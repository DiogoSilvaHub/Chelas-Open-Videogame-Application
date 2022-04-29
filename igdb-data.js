'use strict'

const urllib = require('urllib')
const fetch = require('node-fetch')

const error = require('./covida-errors.js')

module.exports = {
	
	getPopularGames: () => {
		return fetch('https://api.igdb.com/v4/games', {
			method: 'POST',
			headers: {
				'Client-ID': 'rrk0oqytwlxp6vuhe625zfrmj9x47c',
				'Authorization': 'Bearer 12rltcrzolg0va6143d7vr6dwsgr2z'
			},
			body: 'fields name,rating; sort rating desc; where rating != null;',
			
		}).then( response => {
			if (response.status == 200 ) {
				return Promise.resolve(response)
			}
			return Promise.reject(error.EXTERNAL_SERVICE_FAILURE)
			
		}).then(response => response.json())
	},
	
	searchGames:  (gameName) => {
		return fetch('https://api.igdb.com/v4/games', {
			method: 'POST',
			headers: {
				'Client-ID': 'rrk0oqytwlxp6vuhe625zfrmj9x47c',
				'Authorization': 'Bearer 12rltcrzolg0va6143d7vr6dwsgr2z'
			},
			body: 'search "' + gameName + '"; fields name,rating;',
			
		}).then(response => {
			if (response.status == 200 ) {
				return Promise.resolve(response)
			}
			return Promise.reject(error.EXTERNAL_SERVICE_FAILURE)
			
		}).then(response => response.json())
		
		
	},
	
	searchGameByID: (gameID) => {
		
		return fetch('https://api.igdb.com/v4/games', {
			method: 'POST',
			headers: {
				'Client-ID': 'rrk0oqytwlxp6vuhe625zfrmj9x47c',
				'Authorization': 'Bearer 12rltcrzolg0va6143d7vr6dwsgr2z'
			},
			body: 'fields name,rating; where id = ' + gameID + ';',
			
		}).then(response => {
			if (response.status == 200 ) {
				return Promise.resolve(response)
			}
			return Promise.reject(error.EXTERNAL_SERVICE_FAILURE)
			
		}).then(response => response.json())
		
	}
}