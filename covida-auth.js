'use strict';

const passport = require('passport');

const express = require('express');
const session = require('express-session');

const FileStore = require('session-file-store')(session)

module.exports = (app,service) => {
	
	function userToRef(user, done) {
		done(null, user.username);
	}

	function refToUser(userRef, done) {
		service.listUsers().then(users => users.filter(user =>{
			if(user.username == userRef){
				return true
			}
			return false
		})).then(user => {
			if (user.length!=0) {
				done(null, user[0]);
			} else {
				done('User unknown');
			}
		})
	}
	app.use(session({
		resave: true,
		saveUninitialized: true,
		secret: 'isel-leirt',
		store: new FileStore()
	}))

	app.use(passport.initialize())
	app.use(passport.session())
	
	passport.serializeUser(userToRef)
	passport.deserializeUser(refToUser)
	
	return {
		login: (req, username, password) => new Promise((resolve, reject) => {
			if (username && password) {
				service.listUsers().then(users => users.filter(user =>{
					if(user.username == username && user.password == password){
						return true
					}
					return false
				})).then(user => {
					console.log(user[0])
					if (user.length!=0) {
						req.login(user[0], (err, result) => {
							if (err) {
								reject(err)
							} else {
								resolve(result)
							}
						})
					} else {
						reject('Bad username or password.');
					}
				})
				
			} else {
				reject('Missing username or password.')
			}
		}),
		logout: (req) => new Promise((resolve, reject) => {
			req.logout()
			req.session.save(() => {
				resolve()
			})
		}),
		register: (username, password) => new Promise((resolve, reject) => {
			if (username && password) {
				service.listUsers().then(users => users.filter(user =>{
					if(user.username == username){
						return true
					}
					return false
				})).then(user => {
					if (user.length!=0) {
						reject('Username already taken.')
					}else{
						service.register(username, password).then(u => {resolve(u)})
					}
				})
			}else {
				reject('Missing username or password.')
			}
		})
	}
}