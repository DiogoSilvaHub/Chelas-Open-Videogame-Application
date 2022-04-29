'use strict'

const express = require('express')

const error = require('./covida-errors.js')

function webapi(auth, service) {
	
	const theWebApi = {

		login: (req, res) => {
			
			const username = req.body.username
			const password = req.body.password
			
			auth.login(req, username, password)
			.then(() => {
				const answer = { 'result': 'ok' }
				res.json(answer)
			})
			.catch(err => {
				res.status(500).json({ cause: 'Login failed.'})
			})
		},
		
		logout: (req, res) => {
			
			auth.logout(req)
			.then(() => {
				const answer = { 'result': 'ok' }
				res.json(answer)
			})
			.catch(err => {
				res.status(500).json({ cause: 'Logout failed.'})
			})			
		},

		register: (req, res) => {
			auth.register(req.body.username, req.body.password)
			.then(() => {
				const answer = { 'result': 'ok' }
				res.json(answer)
			})
			.catch(err => {
				res.status(500).json({ cause: 'Register failed.'})
			})
		},
		
		PopularGames: ( req, res ) =>  {
			service.getPopularGames().then( popularGames => { 
			
				const answer = { 'PopularGames': popularGames  }
				res.json(answer);
						
				}).catch( err => {
						
					switch (err) {
						case error.EXTERNAL_SERVICE_FAILURE:
							res.status(502).json({ cause: 'External service failure.' })
							break;
						default:
							res.status(500).json({ cause: 'Failed to get games.'})
							break;
					}
						
				})
			
		},
			
		searchGames: ( req, res ) => {
		
			service.searchGames(req.body.game).then(games => {
				const answer = { 'Games': games }
				res.json(answer)
			}).catch(err => {
				switch (err) {
					case error.EXTERNAL_SERVICE_FAILURE:
						res.status(502).json({ cause: 'External service failure.' })
						break;
					case error.MISSING_ARGUMENT:
						res.status(400).json({ cause: 'Missing argument.' })
						break;
					default:
						res.status(500).json({ cause: 'Failed to get games.'})
						break;
				}
			})				
		},
		
		createGroup: ( req, res ) => {
				
			service.createGroup(req.user, req.body.name, req.body.description).then(group => {
				
				const answer = { 'Group': group }
				res.json(answer)
				}).catch(err =>  {
					switch (err) {
						case error.UNAUTHENTICATED:
							res.status(401).json({ cause: 'Requires login.' })
							break;
						case error.MISSING_ARGUMENT:
							res.status(400).json({ cause: 'Missing argument.' })
							break;
						default:
							res.status(500).json({ cause: 'Failed to create group.'})
							break;
					}
					
				})
		},
		
		listGroups: ( req, res ) => {
				
			service.listGroups(req.user).then(groups => {
				if(groups.length == 0){res.json({'Groups': "No groups accessible to this user"})}
				else{
					const answer = { 'Groups': groups }
					res.json(answer)
				}
			}).catch(err =>  {
					switch (err) {
						case error.UNAUTHENTICATED:
							res.status(401).json({ cause: 'Requires login.' })
							break;
						default:
							res.status(500).json({ cause: 'Failed to get groups.'})
							break;
					}
					
				}) 
		},
		
		editGroup: ( req, res ) => {
				
			service.editGroup(req.user, req.body.id, req.body.parameter, req.body.edit).then(group => {
				const answer = { 'Group': group }
				res.json(answer)
			}).catch(err => {
				switch (err) {
					case error.UNAUTHENTICATED:
						res.status(401).json({ cause: 'Requires login.' })
						break;
					case error.UNAUTHORIZED:
						res.status(403).json({ cause: 'Not allowed for user.' })
						break;
					case error.WRONG_ID:
						res.status(400).json({ cause: 'ID non-existent.' })
						break;
					case error.MISSING_ARGUMENT:
						res.status(400).json({ cause: 'Missing argument.' })
						break;
					case error.WRONG_ARGUMENT:
						res.status(400).json({ cause: 'Parameter must be Name / Description.' })
						break;
					default:
						res.status(500).json({ cause: 'Failed to edit group.'})
						break;
				}
			})
		},
		
		showGroup: ( req, res ) => {
				
			service.showGroup(req.user, req.body.id).then( group => {
				const answer = { 'Group': group }
				res.json(answer)
			}).catch(err => {
				switch (err) {
					case error.UNAUTHENTICATED:
						res.status(401).json({ cause: 'Requires login.' })
						break;
					case error.UNAUTHORIZED:
						res.status(403).json({ cause: 'Not allowed for user.' })
						break;
					case error.WRONG_ID:
						res.status(400).json({ cause: 'ID non-existent.' })
						break;
					case error.MISSING_ARGUMENT:
						res.status(400).json({ cause: 'Missing argument.' })
						break;
					default:
						res.status(500).json({ cause: 'Failed to show group.'})
						break;
				}
			})
		},
		
		addGame: ( req, res ) => {
			
			service.addGame(req.user, req.body.groupID, req.body.gameID).then(group => {
				const answer = { 'Group': group }
				res.json(answer)
			}).catch(err => {
				switch (err) {
					case error.UNAUTHENTICATED:
						res.status(401).json({ cause: 'Requires login.' })
						break;
					case error.UNAUTHORIZED:
						res.status(403).json({ cause: 'Not allowed for user.' })
						break;
					case error.EXTERNAL_SERVICE_FAILURE:
						res.status(502).json({ cause: 'External service failure.' })
						break;
					case error.WRONG_ID:
						res.status(400).json({ cause: 'Group ID non-existent.' })
						break;
					case error.MISSING_ARGUMENT:
						res.status(400).json({ cause: 'Missing argument.' })
						break;
					case error.WRONG_ARGUMENT:
						res.status(400).json({ cause: 'Game already exists in this group.' })
						break;
					default:
						res.status(500).json({ cause: 'Failed to add game.'})
						break;
				}
			})
		},
		
		removeGame: ( req, res ) => {
			
			service.removeGame(req.user, req.body.groupID, req.body.gameID).then(group => {
				const answer = { 'Group': group }
				res.json(answer)
			}).catch(err => {
				switch (err) {
					case error.UNAUTHENTICATED:
						res.status(401).json({ cause: 'Requires login.' })
						break;
					case error.UNAUTHORIZED:
						res.status(403).json({ cause: 'Not allowed for user.' })
						break;
					case error.WRONG_ID:
						res.status(400).json({ cause: 'Group ID non-existent.' })
						break;
					case error.MISSING_ARGUMENT:
						res.status(400).json({ cause: 'Missing argument.' })
						break;
					case error.WRONG_ARGUMENT:
						res.status(400).json({ cause: 'Game non-existent in this group.' })
						break;
					default:
						res.status(500).json({ cause: 'Failed to remove game.'})
						break;
				}
			})
		},
		
		gamesByRating: ( req, res ) => {
		
			service.gamesByRating(req.user, req.body.id, req.body.min, req.body.max).then(games => {
				const answer = { 'Games': games }
				res.json(answer)
			}).catch(err => {
				switch (err) {
					case error.UNAUTHENTICATED:
						res.status(401).json({ cause: 'Requires login.' })
						break;
					case error.UNAUTHORIZED:
						res.status(403).json({ cause: 'Not allowed for user.' })
						break;
					case error.WRONG_ID:
						res.status(400).json({ cause: 'ID non-existent.' })
						break;
					case error.MISSING_ARGUMENT:
						res.status(400).json({ cause: 'Missing argument.' })
						break;
					case error.WRONG_ARGUMENT:
						res.status(400).json({ cause: 'Boundaries must be between 0 and 100 and Max must be greater than Min.' })
						break;
					default:
						res.status(500).json({ cause: 'Failed to get games.'})
						break;
				}
			})
		},
		
		removeGroup: ( req, res ) => {
			service.removeGroup(req.user, req.body.id).then( () => {
				const answer = 'Group eliminated'
				res.json(answer)
			}).catch(err => {
				switch (err) {
					case error.UNAUTHENTICATED:
						res.status(401).json({ cause: 'Requires login.' })
						break;
					case error.UNAUTHORIZED:
						res.status(403).json({ cause: 'Not allowed for user.' })
						break;
					case error.WRONG_ID:
						res.status(400).json({ cause: 'ID non-existent.' })
						break;
					case error.MISSING_ARGUMENT:
						res.status(400).json({ cause: 'Missing argument.' })
						break;
					default:
						res.status(500).json({ cause: 'Failed to remove group.'})
						break;
				}
			})
		}
		
	}
	
	const router = express.Router();
	router.use(express.json())
	
	router.get('/popularGames', theWebApi.PopularGames)
	router.post('/searchGames', theWebApi.searchGames)
	router.post('/createGroup', theWebApi.createGroup)
	router.get('/listGroups', theWebApi.listGroups)
	router.post('/editGroup', theWebApi.editGroup)
	router.post('/showGroup', theWebApi.showGroup)
	router.post('/addGame', theWebApi.addGame)
	router.post('/removeGame', theWebApi.removeGame)
	router.post('/gamesByRating', theWebApi.gamesByRating)
	router.post('/removeGroup', theWebApi.removeGroup)
	
	router.post('/login',  theWebApi.login)
	router.post('/logout', theWebApi.logout)
	router.post('/register', theWebApi.register)

	
	return router
	
}

module.exports = webapi