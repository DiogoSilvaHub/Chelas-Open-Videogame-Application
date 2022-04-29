'use strict'

const assert = require('assert')

const serviceCreator = require('../covida-services.js')

const almightyUser = {
	username: "almighty",
	password: 1234
}

describe('service', function () {
	describe('getPopularGames', function() {
		it('should return a json object', function (done) {
			// Arrange
			const game ={ "popularGames" : [
					{
						"id": 131887,
						"name": "Project +",
						"rating": 100.0
					},
					{
					  "id": 26974,
						"name": "Heartbound",
						"rating": 100.0
					},
					{
					  "id": 114283,
					   "name": "Persona 5 Royal",
					   "rating": 99.9639301031148
					}
			]
		  }
			const db = null
			const data = {
				getPopularGames:function () {
					return new Promise((resolve, reject) => {
						resolve(game)
					})
				}
			}
										
			const service = serviceCreator(db, data)
			
			// Act
			service.getPopularGames().then(obj => {

				// Assert
				assert.equal(obj,game)
				
				done()
			})
		})
	}),
	
	describe('searchGames', function() {
		it('should return a json object', function (done) {
			// Arrange
			const game ={ "Games" : [
					{
						"id": 2946,
						"name": "FIFA 12"
					},
					{
						"id": 2153,
						"name": "FIFA 13"
					},
				]
			}
			const db = null
			const data = {
				searchGames:function (gameName) {
					return new Promise((resolve, reject) => {
						resolve(game)
					})
				}
			}
										
			const service = serviceCreator(db, data)
			
			// Act
			service.searchGames('fifa').then(obj => {

				// Assert
				assert.equal(obj,game)
				
				done()
			})
		})
	}),
	
	describe('createGroup', function() {
		it('should return a json object', function (done) {
			// Arrange
			const group ={ "Group": {
					"id": 0,
					"Name": "testName",
					"Description": "testDescription",
					"Games": []
				}
			}
			
			const db = {
				createGroup:function (groupName, groupDescription) {
					return new Promise((resolve, reject) => {
						resolve(group)
					})
				}
			}
			const data = null
										
			const service = serviceCreator(db, data)
			
			// Act
			service.createGroup(almightyUser, 'testName', 'testDescription').then(obj => {

				// Assert
				assert.equal(obj,group)
				
				done()
			})
		})
	}),
	
	describe('listGroups', function() {
		it('should return a json object', function (done) {
			// Arrange
			const groups ={ "Groups": [
					{
						"id": 0,
						"Name": "testName",
						"Description": "testDescription",
						"Games": []
					},
					{
						"id": 1,
						"Name": "testName",
						"Description": "testDescription",
						"Games": []
					}
				]
			}
			
			const db = {
				listGroups:function () {
					return new Promise((resolve, reject) => {
						resolve(groups)
					})
				}
			}
			const data = null
										
			const service = serviceCreator(db, data)
			
			// Act
			service.listGroups(almightyUser).then(obj => {

				// Assert
				assert.equal(obj,groups)
				
				done()
			})
		})
	}),
	
	describe('editGroup', function() {
		it('should return a json object', function (done) {
			// Arrange
			const group ={ "Group": {
					"id": 0,
					"Name": "testName",
					"Description": "testDescriptionEdit",
					"Games": []
				}
			}
			
			const db = {
				editGroup:function (groupID, groupParameter, groupEdit) {
					return new Promise((resolve, reject) => {
						resolve(group)
					})
				}
			}
			const data = null
										
			const service = serviceCreator(db, data)
			
			// Act
			service.editGroup(almightyUser, "0", "Description", "testDescriptionEdit").then(obj => {

				// Assert
				assert.equal(obj, group)
				
				done()
			})
		})
	}),
	
	describe('showGroup', function() {
		it('should return a json object', function (done) {
			// Arrange
			const group ={ "Group": {
					"id": 0,
					"Name": "testName",
					"Description": "testDescriptionEdit",
					"Games": []
				}
			}
			
			const db = {
				showGroup:function (groupID) {
					return new Promise((resolve, reject) => {
						resolve(group)
					})
				}
			}
			const data = null
										
			const service = serviceCreator(db, data)
			
			// Act
			service.showGroup(almightyUser, "0").then(obj => {

				// Assert
				assert.equal(obj, group)
				
				done()
			})
		})
	}),
	
	describe('addGame', function() {
		it('should return a json object', function (done) {
			// Arrange
			const group ={ "Group": {
					"id": 0,
					"Name": "testName",
					"Description": "testDescriptionEdit",
					"Games": [
						{
							"id": 131887,
							"name": "Project +",
							"rating": 100.0
						}
					]
				}
			}
			
			const game ={ 
					"id": 131887,
					"name": "Project +",
					"rating": 100.0
			}
			
			const db = {
				addGame:function (groupID, gameID, game) {
					return new Promise((resolve, reject) => {
						resolve(group)
					})
				}
			}
			const data = {
				searchGameByID:function (gameID) {
					return new Promise((resolve, reject) => {
						resolve(game)
					})
				}
			}
										
			const service = serviceCreator(db, data)
			
			// Act
			service.addGame(almightyUser, "0", "131887").then(obj => {

				// Assert
				assert.equal(obj, group)
				
				done()
			})
		})
	}),
	
	describe('removeGame', function() {
		it('should return a json object', function (done) {
			// Arrange
			const group ={ "Group": {
					"id": 0,
					"Name": "testName",
					"Description": "testDescriptionEdit",
					"Games": []
				}
			}
			
			const db = {
				removeGame:function (groupID, gameID) {
					return new Promise((resolve, reject) => {
						resolve(group)
					})
				}
			}
			const data = null
										
			const service = serviceCreator(db, data)
			
			// Act
			service.removeGame(almightyUser, "0", "131887").then(obj => {

				// Assert
				assert.equal(obj, group)
				
				done()
			})
		})
	}),
	
	describe('gamesByRating', function() {
		it('should return a json object', function (done) {
			// Arrange
			const group ={ "Group": {
					"id": 0,
					"Name": "testName",
					"Description": "testDescriptionEdit",
					"Games": [
						{
							"id": 131887,
							"name": "Project +",
							"rating": 100.0
						},
						{
						  "id": 26974,
							"name": "Heartbound",
							"rating": 100.0
						},
						{
						  "id": 114283,
						   "name": "Persona 5 Royal",
						   "rating": 99.9639301031148
						}
					]
				}
			}
			
			const db = {
				gamesByRating:function (groupID, minRating, maxRating) {
					return new Promise((resolve, reject) => {
						resolve(group)
					})
				}
			}
			const data = null
										
			const service = serviceCreator(db, data)
			
			// Act
			service.gamesByRating(almightyUser, "0", "90", "100").then(obj => {

				// Assert
				assert.equal(obj, group)
				
				done()
			})
		})
	}),
	
	describe('removeGroup', function() {
		it('should return a json object', function (done) {
			// Arrange
			const groups ={ "Groups": [
					{
						"id": 0,
						"Name": "testName",
						"Description": "testDescription",
						"Games": []
					}
				]
			}
			
			const db = {
				removeGroup:function (groupID) {
					return new Promise((resolve, reject) => {
						resolve(groups)
					})
				}
			}
			const data = null
										
			const service = serviceCreator(db, data)
			
			// Act
			service.removeGroup(almightyUser, "1").then(obj => {

				// Assert
				assert.equal(obj, groups)
				
				done()
			})
		})
	})
	
	
})