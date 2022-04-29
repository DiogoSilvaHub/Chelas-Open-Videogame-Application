'use strict'

const fetch = require('node-fetch')

const error = require('./covida-errors.js')

function storage(host, port) {
	
	const baseUrl = `http://${host}:${port}`
	
	const itemsBaseUrl = `${baseUrl}/covida`
	
	const usersBaseUrl = `${baseUrl}/covida-users`
	
	const theStorage = {
		
		listGroups: (user) => {
			return fetch(`${itemsBaseUrl}/_search?size=100`)
				.then( response => response.json())
				.then( answer => answer.hits.hits.filter(hit => {
					if(hit._source.user.name == user.name && hit._source.user.password == user.password){
						return true
					}
					return false
				}).map(hit => {
					let group = hit._source
					group["id"] = hit._id
					return group
				}))
		},

		createGroup: (user, groupName, groupDescription) => {
			return fetch(`${itemsBaseUrl}/_doc`, {
					method: 'POST',
					headers: {
						"Content-Type": "application/json"
					},
					body: JSON.stringify({
						"user": user, "name": groupName, "description": groupDescription, "games" : []
					})
				}).then( response => response.json())
				.then(answer => answer._id)
		},
		
		editGroup: (user, groupID, groupParameter, groupEdit) => {
			fetch(`${itemsBaseUrl}/_doc/${groupID}`, {
				method: 'GET',
				headers: {
					"Content-Type": "application/json"
				}
				}).then( response => response.json())
				.then(answer => {
					if(answer._source.user.name != user.name && answer._source.user.password != user.password){ return Promise.reject(error.UNAUTHORIZED)}
				})
			if(groupParameter == 'Name' ){
				return fetch(`${itemsBaseUrl}/_update/${groupID}?refresh=true`, {
					method: 'POST',
					headers: {
						"Content-Type": "application/json"
					},
					body: JSON.stringify({
						"doc" : { "name" : groupEdit }
					})
				}).then(r => fetch(`${itemsBaseUrl}/_doc/${groupID}`, {
					method: 'GET',
					headers: {
						"Content-Type": "application/json"
					}
				})
				).then( response => response.json())
				.then(answer => {
					if (!answer.found){ return Promise.reject(error.WRONG_ID)}
					return answer._source
				})
			}else if(groupParameter == 'Description'){
				return fetch(`${itemsBaseUrl}/_update/${groupID}?refresh=true`, {
					method: 'POST',
					headers: {
						"Content-Type": "application/json"
					},
					body: JSON.stringify({
						"doc" : { "description" : groupEdit }
					})
				}).then(r => fetch(`${itemsBaseUrl}/_doc/${groupID}`, {
					method: 'GET',
					headers: {
						"Content-Type": "application/json"
					}
				})
				).then( response => response.json())
				.then(answer => {
					if (!answer.found){ return Promise.reject(error.WRONG_ID)}
					return answer._source
				})
			}
			return Promise.reject(error.WRONG_ARGUMENT)
		},
	
		showGroup: (user, groupID) => {
			return fetch(`${itemsBaseUrl}/_doc/${groupID}`, {
					method: 'GET',
					headers: {
						"Content-Type": "application/json"
					}
				}).then( response => response.json())
				.then(answer => {
					if(answer._source.user.name != user.name && answer._source.user.password != user.password){ return Promise.reject(error.UNAUTHORIZED)}
					if (!answer.found){ return Promise.reject(error.WRONG_ID)}
					return answer._source
				})
		},
	
		addGame: (user, groupID, gameID, game) => {
			return fetch(`${itemsBaseUrl}/_doc/${groupID}`, {
				method: 'GET',
				headers: {
					"Content-Type": "application/json"
				}
			}).then( response => response.json())
			.then(answer => {
				if(answer._source.user.name != user.name && answer._source.user.password != user.password){ return Promise.reject(error.UNAUTHORIZED)}
				if (!answer.found){ return Promise.reject(error.WRONG_ID)}
				let group = answer._source
				const gm = group.games.find(g => g.id == gameID)
				if(!gm){
					group.games = group.games.concat(game)
					fetch(`${itemsBaseUrl}/_update/${groupID}?refresh=true`, {
						method: 'POST',
						headers: {
							"Content-Type": "application/json"
						},
						body: JSON.stringify({
							"doc" : { "games" : group.games }
						})
					})
					return group
				}
				return Promise.reject(error.WRONG_ARGUMENT)
			})
		},
	
		removeGame: (user, groupID, gameID) => {
			return fetch(`${itemsBaseUrl}/_doc/${groupID}`, {
				method: 'GET',
				headers: {
					"Content-Type": "application/json"
				}
			}).then( response => response.json())
			.then(answer => {
				if(answer._source.user.name != user.name && answer._source.user.password != user.password){ return Promise.reject(error.UNAUTHORIZED)}
				if (!answer.found){ return Promise.reject(error.WRONG_ID)}
				let group = answer._source
				const oldSize = group.games.length
				group.games = group.games.filter( function(gm){
					return gm.id != gameID
				})
				if(oldSize == group.games.length){ return Promise.reject(error.WRONG_ARGUMENT) }
				fetch(`${itemsBaseUrl}/_update/${groupID}?refresh=true`, {
					method: 'POST',
					headers: {
						"Content-Type": "application/json"
					},
					body: JSON.stringify({
						"doc" : { "games" : group.games }
					})
				})
				return group
			})
		},
	
		gamesByRating: (user, groupID, minRating, maxRating) => {
			return fetch(`${itemsBaseUrl}/_doc/${groupID}`, {
				method: 'GET',
				headers: {
					"Content-Type": "application/json"
				}
			}).then( response => response.json())
			.then(answer => {
				if(answer._source.user.name != user.name && answer._source.user.password != user.password){ return Promise.reject(error.UNAUTHORIZED)}
				if (!answer.found){ return Promise.reject(error.WRONG_ID)}
				let group = answer._source
				if(maxRating >= 0 && minRating >= 0 && maxRating <= 100 && minRating <= 100 && minRating <= maxRating){
					let games = group.games.filter( function(gm){
						return gm.rating >= minRating && gm.rating <= maxRating
					})
					games = games.sort((gm1 ,gm2) => gm2.rating-gm1.rating)
					return games
				}
				return Promise.reject(error.WRONG_ARGUMENT) 
			})
		},
	
		removeGroup: (user, groupID) => {
			fetch(`${itemsBaseUrl}/_doc/${groupID}`, {
				method: 'GET',
				headers: {
					"Content-Type": "application/json"
				}
				}).then( response => response.json())
				.then(answer => {
					if(answer._source.user.name != user.name && answer._source.user.password != user.password){ return Promise.reject(error.UNAUTHORIZED)}
				})
			return fetch(`${itemsBaseUrl}/_doc/${groupID}`, {
				method: 'DELETE',
				headers: {
					"Content-Type": "application/json"
				}
			}).then( response => response.json())
			.then(answer => {
				if(answer.result == 'not_found'){return Promise.reject(error.WRONG_ID)}
			})
		},
	
		register: (username, password) => {
			return fetch(`${usersBaseUrl}/_doc`, {
					method: 'POST',
					headers: {
						"Content-Type": "application/json"
					},
					body: JSON.stringify({
						"username": username, "password": password
					})
				}).then( response => response.json())
				.then(answer => fetch(`${usersBaseUrl}/_doc/${answer._id}`, {
					method: 'GET',
					headers: {
						"Content-Type": "application/json"
					}
				}).then( response => response.json()).then(answer => answer._source))
		},
		
		listUsers: () => {
			return fetch(`${usersBaseUrl}/_search?size=100`)
				.then( response => response.json())
				.then( answer => {
					if(answer.error){
						return []
					}else {
						return answer.hits.hits.map(hit => {
							return hit._source
						})
					}
				}
			)
		}
		
	}
	
	return theStorage

}

module.exports = storage