'use strict'

const error = require('./covida-errors.js')

let db = null
let id = 0

module.exports = {
	
	listGroups: () => {
		return new Promise((resolve, reject) => {
			setImmediate(() => {
				resolve(db)
			})
		})
	},
	
	createGroup: (groupName, groupDescription) => {
		return new Promise((resolve, reject) => {
			setImmediate(() => {
				const groups = db || []
				const group = { id : id++, Name : groupName, Description : groupDescription, Games : [] };
				groups.push(group)
				db = groups
				resolve(group)
			})
		})
	},
	
	editGroup: (groupID, groupParameter, groupEdit) => {
		return new Promise((resolve, reject) => {
			setImmediate(() => {
				if(db == null ) { reject(error.WRONG_ID) }else{
					const group = db.find(g => g.id == groupID)
					if(group){ 
						switch(groupParameter){
							case 'Name':
								group.Name = groupEdit
								resolve(group)
								break
							case 'Description':
								group.Description = groupEdit
								resolve(group)
								break
							default:
								reject(error.WRONG_ARGUMENT)
								break
						}
					}else{
						reject(error.WRONG_ID)
					}
				}
			})
		})
	},
	
	showGroup: (groupID) => {
		return new Promise((resolve, reject) => {
			setImmediate(() => {
				if(db == null ) { reject(error.WRONG_ID) } else{
					const group = db.find(g => g.id == groupID)
					if(group){ 
						resolve(group) 
					}else{
						reject(error.WRONG_ID)
					}
				}
			})
		})
	},
	
	addGame: (groupID, gameID, game) => {
		return new Promise((resolve, reject) => {
			setImmediate(() => {
				if(db == null ) { reject(error.WRONG_ID) } else{
					const group = db.find(g => g.id == groupID)
					if(group){ 
						const gm = group.Games.find(g => g.id == gameID)
						if(!gm){
							group.Games = group.Games.concat(game)
							resolve(group) 
						}else{
							reject(error.WRONG_ARGUMENT)
						}
					}else{
						reject(error.WRONG_ID)
					}
				}
			})
		})
	},
	
	removeGame: (groupID, gameID) => {
		return new Promise((resolve, reject) => {
			setImmediate(() => {
				if(db == null ) { reject(error.WRONG_ID) } else{
					const group = db.find(g => g.id == groupID)
					if(group){ 
						const oldSize = group.Games.length
						group.Games = group.Games.filter( function(gm){
							return gm.id != gameID
						})
						if(oldSize != group.Games.length){
							resolve(group) 
						}else{
							reject(error.WRONG_ARGUMENT) 
						}
					}else{
						reject(error.WRONG_ID)
					}
				}
			})
		})
	},
	
	gamesByRating: (groupID, minRating, maxRating) => {
		
		return new Promise((resolve, reject) => {
			setImmediate(() => {
				if(db == null ) { reject(error.WRONG_ID) } else{
					const group = db.find(g => g.id == groupID)
					if(group){ 
						if(maxRating >= 0 && minRating >= 0 && maxRating <= 100 && minRating <= 100 && minRating <= maxRating){
							let games = group.Games.filter( function(gm){
								return gm.rating >= minRating && gm.rating <= maxRating
							})
							games = games.sort((gm1 ,gm2) => gm2.rating-gm1.rating)
							resolve(games) 
						}else{
							reject(error.WRONG_ARGUMENT) 
						}
					}else{
						reject(error.WRONG_ID)
					}
				}
			})
		})
	},
	
	removeGroup: (groupID) => {
		return new Promise((resolve, reject) => {
			setImmediate(() => {
				if(db == null ) { reject(error.WRONG_ID) } else{
					const oldSize = db.length
					db = db.filter(function(gr){
						return gr.id != groupID
					})
					if(oldSize != db.length){
						resolve(null) 
					}else{
						reject(error.WRONG_ID) 
					}
				}
			})
		})
	}
}