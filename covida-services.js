'use strict'

const error = require('./covida-errors.js')

function service(db, data) {
	
	const theService = {
		
		getPopularGames: () => {
			return new Promise((resolve, reject) =>	{
				resolve(data.getPopularGames())
			})
		},
		
		searchGames: (gameName) => {
			return new Promise((resolve, reject) =>	{
				if ( gameName && gameName.trim()) {
					resolve(data.searchGames(gameName))
				}else{
					reject(error.MISSING_ARGUMENT)
				}
			})
		},
		
		createGroup: (user, groupName, groupDescription) => {
			return new Promise((resolve, reject) =>	{
				if (!user) {
					reject(error.UNAUTHENTICATED)
				}
				if ( groupName && groupName.trim()) {
					resolve(db.createGroup(user, groupName.trim(), groupDescription.trim()))
				}else{
					reject(error.MISSING_ARGUMENT)
				}
			})
		},
		
		listGroups: (user) => {
			return new Promise((resolve, reject) =>	{
				if (!user) {
					reject(error.UNAUTHENTICATED)
				}
				resolve(db.listGroups(user))
			})
		},
		
		editGroup: (user, groupID, groupParameter, groupEdit) => {
			return new Promise((resolve, reject) =>	{
				if (!user) {
					reject(error.UNAUTHENTICATED)
				}
				if ( groupID && groupParameter && groupEdit && groupID.trim()) {
					resolve(db.editGroup(user, groupID, groupParameter.trim(), groupEdit.trim()))
				}else {
					reject(error.MISSING_ARGUMENT)
				}
			})
		},
		
		showGroup: (user, groupID) => {
			return new Promise((resolve, reject) =>	{
				if (!user) {
					reject(error.UNAUTHENTICATED)
				}
				if ( groupID &&  groupID.trim()) {
					resolve(db.showGroup(user, groupID))
				}else {
					reject(error.MISSING_ARGUMENT)
				}
			})
		},
		
		addGame: (user, groupID, gameID) => {
			return new Promise((resolve, reject) =>	{
				if (!user) {
					reject(error.UNAUTHENTICATED)
				}
				if ( groupID && gameID && groupID.trim() && gameID.trim()) {
					data.searchGameByID(gameID).then(game => resolve(db.addGame(user, groupID, gameID, game)))
				}else {
					reject(error.MISSING_ARGUMENT)
				}
			})
		},
		
		removeGame: (user, groupID, gameID) => {
			return new Promise((resolve, reject) =>	{
				if (!user) {
					reject(error.UNAUTHENTICATED)
				}
				if ( groupID && gameID && groupID.trim() && gameID.trim()) {
					resolve(db.removeGame(user, groupID, gameID))
				}else {
					reject(error.MISSING_ARGUMENT)
				}
			})
		},
		
		gamesByRating: (user, groupID, minRating, maxRating) => {
			return new Promise((resolve, reject) =>	{
				if (!user) {
					reject(error.UNAUTHENTICATED)
				}
				if ( groupID && maxRating && minRating && groupID.trim() && maxRating.trim() && minRating.trim()) {
					resolve(db.gamesByRating(user, groupID, parseInt(minRating), parseInt(maxRating)))
				}else{
					reject(error.MISSING_ARGUMENT)
				}
			})
		},
		
		removeGroup: (user, groupID, resFunc) => {
			return new Promise((resolve, reject) =>	{
				if (!user) {
					reject(error.UNAUTHENTICATED)
				}
				if ( groupID && groupID.trim()) {
					resolve(db.removeGroup(user, groupID))
				}else {
					reject(error.MISSING_ARGUMENT)
				}
			})			
		},
		
		register: (username, password) => {
			return new Promise((resolve, reject) =>	{
					resolve(db.register(username, password))
			})			
		},
		
		listUsers: () => {
			return new Promise((resolve, reject) =>	{
					resolve(db.listUsers())
			})			
		}
		
	}
	
	return theService
}

module.exports = service