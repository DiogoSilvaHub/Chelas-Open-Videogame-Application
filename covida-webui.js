'use strict';

const express = require('express')

const error = require('./covida-errors.js')

function webui(auth, service){
	
	const theWebUI = {

		login: (req, res) => {
			auth.login(req, req.body.username, req.body.password)
			.then(() => {
				setTimeout(() => {
					res.redirect('/')
				}, 3000);
			})
			.catch(err => {
				res.statusCode = 401
				res.render('logerr', { user: req.user, error: err })
			})
		},

		logout: (req, res) => {
			auth.logout(req)
			.then(() => {
				setTimeout(() => {
					res.redirect('/')
				}, 1000);
			})
			.catch(err => {
				res.statusCode = 401
				res.render('logerr', { user: req.user, error: err })
			})
		},

		loginForm: (req, res) => {
			res.render('login', { user: req.user })
		},

		register: (req, res) => {
			auth.register(req.body.username, req.body.password)
			.then(() => {
				setTimeout(() => {
					res.redirect(307, 'login')
				}, 1000);
			})
			.catch(err => {
				res.statusCode = 401
				res.render('logerr', { user: req.user, error: err })
			})
		},

		registerForm: (req, res) => {
			res.render('register', { user: req.user })
		},

		home: (req, res) => {
			res.render('home', { user: req.user })
		},
		
		popularGames: (req, res) => {
			service.getPopularGames()
			.then(popularGames => {
				const answer = { 'PopularGames': popularGames,  user: req.user}
				res.render('popularGames',answer)
			})
			.catch(err => {
				switch (err) {
					case error.EXTERNAL_SERVICE_FAILURE:
						console.log('ERROR', 'External service failure.', err)
						res.statusCode = 502;
						res.send(`<html><body><strong>ERROR</strong> External service failure</body></html>`)
						break;
					default:
						console.log('ERROR', 'Failed to get games.', err)
						res.statusCode = 502;
						res.send(`<html><body><strong>ERROR</strong> Failed to get games</body></html>`)
						break;
				}
				res.redirect('/')
			})
		},
		
		insertGameToSearch: (req, res) => {
			res.render('insertGameToSearch', { user: req.user })
		},
			
		searchGames: ( req, res ) => {
			
			service.searchGames(req.body.game).then(games => {
				const answer = { 'Games': games,  user: req.user }
				res.render('searchGames',answer)
			}).catch(err => {
				switch (err) {
					case error.EXTERNAL_SERVICE_FAILURE:
						console.log('ERROR', 'External service failure.', err)
						res.statusCode = 502;
						res.send(`<html><body><strong>ERROR</strong> External service failure</body></html>`)
						break;
					case error.MISSING_ARGUMENT:
						console.log('ERROR', 'Missing argument.', err)
						res.statusCode = 400;
						res.send(`<html><body><strong>ERROR</strong> Missing argument</body></html>`)
						break;
					default:
						console.log('ERROR', 'Failed to get games.', err)
						res.statusCode = 500;
						res.send(`<html><body><strong>ERROR</strong> Failed to get games</body></html>`)
						break;
				}
				res.redirect('/')
			})				
		},
		
		insertGroupToCreate: (req, res) => {
			res.render('insertGroupToCreate', { user: req.user })
		},
		
		createGroup: ( req, res ) => {
				
			service.createGroup(req.user, req.body.name, req.body.description).then(group => {
					setTimeout(() => {
						res.redirect('listGroups')
					}, 1000);
				}).catch(err =>  {
					switch (err) {
					case error.UNAUTHENTICATED:
						console.log('ERROR', 'This operation requires login.', err)
						res.statusCode = 502;
						res.send(`<html><body><strong>ERROR</strong> This operation requires login</body></html>`)
						break;
						case error.MISSING_ARGUMENT:
							console.log('ERROR', 'Missing argument.', err)
							res.statusCode = 400;
							res.send(`<html><body><strong>ERROR</strong> Missing argument</body></html>`)
							break;
						default:
						console.log('ERROR', 'Failed to create group.', err)
						res.statusCode = 500;
						res.send(`<html><body><strong>ERROR</strong> Failed to create group</body></html>`)
						break;
					}
					res.redirect('/')
					
				})
		},
		
		listGroups: ( req, res ) => {
				
			service.listGroups(req.user).then(groups => {
				if(groups.length == 0){res.render('noGroups',  {user: req.user})}
				else{
					groups.forEach(group => group.games.forEach(game => game.groupID = group.id) )
					const answer = { 'Groups': groups,  user: req.user }
					res.render('listGroups',answer)
				}
			}).catch(err => {
				switch (err) {
					case error.UNAUTHENTICATED:
						console.log('ERROR', 'This operation requires login.', err)
						res.statusCode = 502;
						res.send(`<html><body><strong>ERROR</strong> This operation requires login</body></html>`)
						break;
					default:
						console.log('ERROR', 'Failed to get groups.', err)
						res.statusCode = 500;
						res.send(`<html><body><strong>ERROR</strong> Failed to get groups</body></html>`)
						break;
				}
				res.redirect('/')
			})
		},
		
		insertGroupToEdit: (req, res) => {
			const answer = { 'id': req.body.id ,  user: req.user}
			res.render('insertGroupToEdit',answer)
		},
		
		editGroup: ( req, res ) => {
			
			service.editGroup(req.user, req.body.id, req.body.parameter, req.body.edit).then(group => {
				setTimeout(() => {
					res.redirect(307, 'showGroup')
				}, 1000);
			}).catch(err => {
				switch (err) {
					case error.UNAUTHENTICATED:
						console.log('ERROR', 'This operation requires login.', err)
						res.statusCode = 502;
						res.send(`<html><body><strong>ERROR</strong> This operation requires login</body></html>`)
						break;
					case error.UNAUTHORIZED:
						console.log('ERROR', 'Operation not allowed for this user.', err)
						res.statusCode = 502;
						res.send(`<html><body><strong>ERROR</strong> Operation not allowed for this user</body></html>`)
						break;
					case error.WRONG_ID:
						res.status(400).json({ cause: 'ID non-existent.' })
						console.log('ERROR', 'ID non-existent.', err)
						res.statusCode = 400;
						res.send(`<html><body><strong>ERROR</strong> ID non-existent</body></html>`)
						break;
					case error.MISSING_ARGUMENT:
						console.log('ERROR', 'Missing argument.', err)
						res.statusCode = 400;
						res.send(`<html><body><strong>ERROR</strong> Missing argument</body></html>`)
						break;
					case error.WRONG_ARGUMENT:
						console.log('ERROR', 'Parameter must be Name / Description.', err)
						res.statusCode = 400;
						res.send(`<html><body><strong>ERROR</strong> Parameter must be Name / Description</body></html>`)
						break;
					default:
						console.log('ERROR', 'Failed to edit group.', err)
						res.statusCode = 500;
						res.send(`<html><body><strong>ERROR</strong> Failed to edit group</body></html>`)
						break;
				}
				res.redirect('/')
			})
		},
		
		showGroup: ( req, res ) => {
				
			service.showGroup(req.user, req.body.id).then( group => {
				const answer = { 'Group': group,  user: req.user }
				res.render('showGroup',answer)
			}).catch(err => {
				switch (err) {
					case error.UNAUTHENTICATED:
						console.log('ERROR', 'This operation requires login.', err)
						res.statusCode = 502;
						res.send(`<html><body><strong>ERROR</strong> This operation requires login</body></html>`)
						break;
					case error.UNAUTHORIZED:
						console.log('ERROR', 'Operation not allowed for this user.', err)
						res.statusCode = 502;
						res.send(`<html><body><strong>ERROR</strong> Operation not allowed for this user</body></html>`)
						break;
					case error.WRONG_ID:
						res.status(400).json({ cause: 'ID non-existent.' })
						console.log('ERROR', 'ID non-existent.', err)
						res.statusCode = 400;
						res.send(`<html><body><strong>ERROR</strong> ID non-existent</body></html>`)
						break;
					case error.MISSING_ARGUMENT:
						console.log('ERROR', 'Missing argument.', err)
						res.statusCode = 400;
						res.send(`<html><body><strong>ERROR</strong> Missing argument</body></html>`)
						break;
					default:
						console.log('ERROR', 'Failed to show group.', err)
						res.statusCode = 500;
						res.send(`<html><body><strong>ERROR</strong> Failed to show group</body></html>`)
						break;
				}
				res.redirect('/')
			})
		},
		
		whichGroup: (req, res) => {
			
			service.listGroups(req.user).then(groups => {
				if(groups.length == 0){res.render('noGroups',  {user: req.user})}
				else{
					groups.forEach(group => group.gameID = req.body.id )
					const answer = { 'Groups': groups,  user: req.user}
					res.render('whichGroup',answer)
				}
			}).catch(err => {
				switch (err) {
					case error.UNAUTHENTICATED:
						console.log('ERROR', 'This operation requires login.', err)
						res.statusCode = 502;
						res.send(`<html><body><strong>ERROR</strong> This operation requires login</body></html>`)
						break;
					case error.UNAUTHORIZED:
						console.log('ERROR', 'No groups accessible to this user.', err)
						res.statusCode = 502;
						res.send(`<html><body><strong>ERROR</strong> No groups accessible to this user</body></html>`)
						break;
					default:
						console.log('ERROR', 'Failed to get groups.', err)
						res.statusCode = 500;
						res.send(`<html><body><strong>ERROR</strong> Failed to get groups</body></html>`)
						break;
				}
				res.redirect('/')
			})
		},
		
		addGame: ( req, res ) => {
			
			service.addGame(req.user, req.body.id, req.body.gameID).then(group => {
				setTimeout(() => {
					res.redirect(307, 'showGroup')
				}, 1000);
			}).catch(err => {
				switch (err) {
					case error.UNAUTHENTICATED:
						console.log('ERROR', 'This operation requires login.', err)
						res.statusCode = 502;
						res.send(`<html><body><strong>ERROR</strong> This operation requires login</body></html>`)
						break;
					case error.UNAUTHORIZED:
						console.log('ERROR', 'Operation not allowed for this user.', err)
						res.statusCode = 502;
						res.send(`<html><body><strong>ERROR</strong> Operation not allowed for this user</body></html>`)
						break;
					case error.EXTERNAL_SERVICE_FAILURE:
						console.log('ERROR', 'External service failure.', err)
						res.statusCode = 502;
						res.send(`<html><body><strong>ERROR</strong> External service failure</body></html>`)
						break;
					case error.WRONG_ID:
						console.log('ERROR', 'ID non-existent.', err)
						res.statusCode = 400;
						res.send(`<html><body><strong>ERROR</strong> ID non-existent</body></html>`)
						break;
					case error.MISSING_ARGUMENT:
						console.log('ERROR', 'Missing argument.', err)
						res.statusCode = 400;
						res.send(`<html><body><strong>ERROR</strong> Missing argument</body></html>`)
						break;
					case error.WRONG_ARGUMENT:
						console.log('ERROR', 'Game already exists in this group.', err)
						res.statusCode = 400;
						res.send(`<html><body><strong>ERROR</strong> Game already exists in this group</body></html>`)
						break;
					default:
						console.log('ERROR', 'Failed to add game.', err)
						res.statusCode = 500;
						res.send(`<html><body><strong>ERROR</strong> Failed to add game</body></html>`)
						break;
				}
				res.redirect('/')
			})
		},
		
		removeGame: ( req, res ) => {
			
			service.removeGame(req.user, req.body.id, req.body.gameID).then(group => {
				setTimeout(() => {
					res.redirect(307, 'showGroup')
				}, 1000);
			}).catch(err => {
				switch (err) {
					case error.UNAUTHENTICATED:
						console.log('ERROR', 'This operation requires login.', err)
						res.statusCode = 502;
						res.send(`<html><body><strong>ERROR</strong> This operation requires login</body></html>`)
						break;
					case error.UNAUTHORIZED:
						console.log('ERROR', 'Operation not allowed for this user.', err)
						res.statusCode = 502;
						res.send(`<html><body><strong>ERROR</strong> Operation not allowed for this user</body></html>`)
						break;
					case error.WRONG_ID:
						console.log('ERROR', 'ID non-existent.', err)
						res.statusCode = 400;
						res.send(`<html><body><strong>ERROR</strong> ID non-existent</body></html>`)
						break;
					case error.MISSING_ARGUMENT:
						console.log('ERROR', 'Missing argument.', err)
						res.statusCode = 400;
						res.send(`<html><body><strong>ERROR</strong> Missing argument</body></html>`)
						break;
					case error.WRONG_ARGUMENT:
						console.log('ERROR', 'Game non-existent in this group.', err)
						res.statusCode = 400;
						res.send(`<html><body><strong>ERROR</strong> Game non-existent in this group</body></html>`)
						break;
					default:
						console.log('ERROR', 'Failed to remove game.', err)
						res.statusCode = 500;
						res.send(`<html><body><strong>ERROR</strong> Failed to remove game</body></html>`)
						break;
				}
				res.redirect('/')
			})
		},
		
		insertBoundaries: (req, res) => {
			const answer = { 'id': req.body.id,  user: req.user}
			res.render('insertBoundaries',answer)
		},
		
		gamesByRating: ( req, res ) => {
		
			service.gamesByRating(req.user, req.body.id, req.body.min, req.body.max).then(games => {
				const answer = { 'Games': games,  user: req.user }
				res.render('gamesByRating',answer)
			}).catch(err => {
				switch (err) {
					case error.UNAUTHENTICATED:
						console.log('ERROR', 'This operation requires login.', err)
						res.statusCode = 502;
						res.send(`<html><body><strong>ERROR</strong> This operation requires login</body></html>`)
						break;
					case error.UNAUTHORIZED:
						console.log('ERROR', 'Operation not allowed for this user.', err)
						res.statusCode = 502;
						res.send(`<html><body><strong>ERROR</strong> Operation not allowed for this user</body></html>`)
						break;
					case error.WRONG_ID:
						console.log('ERROR', 'ID non-existent.', err)
						res.statusCode = 400;
						res.send(`<html><body><strong>ERROR</strong> ID non-existent</body></html>`)
						break;
					case error.MISSING_ARGUMENT:
						console.log('ERROR', 'Missing argument.', err)
						res.statusCode = 400;
						res.send(`<html><body><strong>ERROR</strong> Missing argument</body></html>`)
						break;
					case error.WRONG_ARGUMENT:
						console.log('ERROR', 'Boundaries must be between 0 and 100 and Max must be greater than Min.', err)
						res.statusCode = 400;
						res.send(`<html><body><strong>ERROR</strong> Boundaries must be between 0 and 100 and Max must be greater than Min</body></html>`)
						break;
					default:
						console.log('ERROR', 'Failed to get games.', err)
						res.statusCode = 500;
						res.send(`<html><body><strong>ERROR</strong> Failed to get games</body></html>`)
						break;
				}
				res.redirect('/')
			})
		},
		
		removeGroup: ( req, res ) => {
			service.removeGroup(req.user, req.body.id).then( () => {
				setTimeout(() => {
						res.redirect('listGroups')
				}, 1000);
			}).catch(err => {
				switch (err) {
					case error.UNAUTHENTICATED:
						console.log('ERROR', 'This operation requires login.', err)
						res.statusCode = 502;
						res.send(`<html><body><strong>ERROR</strong> This operation requires login</body></html>`)
						break;
					case error.UNAUTHORIZED:
						console.log('ERROR', 'Operation not allowed for this user.', err)
						res.statusCode = 502;
						res.send(`<html><body><strong>ERROR</strong> Operation not allowed for this user</body></html>`)
						break;
					case error.WRONG_ID:
						console.log('ERROR', 'ID non-existent.', err)
						res.statusCode = 400;
						res.send(`<html><body><strong>ERROR</strong> ID non-existent</body></html>`)
						break;
					case error.MISSING_ARGUMENT:
						console.log('ERROR', 'Missing argument.', err)
						res.statusCode = 400;
						res.send(`<html><body><strong>ERROR</strong> Missing argument</body></html>`)
						break;
					default:
						console.log('ERROR', 'Failed to remove group.', err)
						res.statusCode = 500;
						res.send(`<html><body><strong>ERROR</strong> Failed to remove group</body></html>`)
						break;
				}
				res.redirect('/')
			})
		}
	}

	const router = express.Router();
	router.use(express.urlencoded({ extended: true }))
	
	router.get('/', theWebUI.home)
	router.get('/popularGames',  theWebUI.popularGames)
	router.post('/searchGames',  theWebUI.searchGames)
	router.get('/insertGameToSearch', theWebUI.insertGameToSearch)
	router.post('/createGroup',  theWebUI.createGroup)
	router.get('/insertGroupToCreate', theWebUI.insertGroupToCreate)
	router.get('/listGroups',  theWebUI.listGroups)
	router.post('/insertGroupToEdit', theWebUI.insertGroupToEdit)
	router.post('/editGroup', theWebUI.editGroup)
	router.post('/showGroup', theWebUI.showGroup)
	router.post('/whichGroup', theWebUI.whichGroup)
	router.post('/addGame', theWebUI.addGame)
	router.post('/removeGame', theWebUI.removeGame)
	router.post('/insertBoundaries', theWebUI.insertBoundaries)
	router.post('/gamesByRating', theWebUI.gamesByRating)
	router.post('/removeGroup', theWebUI.removeGroup)
	
	router.get('/login',  theWebUI.loginForm)
	router.post('/login', theWebUI.login)
	router.get('/logout', theWebUI.logout)
	router.get('/register',  theWebUI.registerForm)
	router.post('/register', theWebUI.register)
	
	return router;
}

module.exports = webui