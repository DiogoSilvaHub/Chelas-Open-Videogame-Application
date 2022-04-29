'use strict';

const frisby = require('frisby');

const base_url = 'http://localhost:8888'

// GROUP IDs MUST BE CHANGED TO EXISTING GROUP IDs IN DATABASE

describe(`Integration tests on ${base_url}`, () => {

	describe('Checking if server is running', () => {
		test ('the server must be running', () => {
			return frisby.get(`${base_url}/`)
		});
	});
	
	describe("Testing 'PopularGames'", () => {
		describe('GET /popularGames', () => {
			it ('should return the most popular games', () => {
				return frisby
					.get(`${base_url}/popularGames`)
					.expect('status', 200)
					.expect('header', 'Content-Type', 'application/json; charset=utf-8')
					.expect('jsonTypes', {
						'PopularGames': frisby.Joi.array().required()
					})
			});
		});
	});
	
	
	
	describe("Testing 'searchGames'", () => {
		describe('POST /searchGames', () => {
			it ('should return the searched games', () => {
				return frisby
					.post(`${base_url}/searchGames`, {
						"game" : "sonic"
					})
					.expect('status', 200)
					.expect('header', 'Content-Type', 'application/json; charset=utf-8')
					.expect('jsonTypes', {
						'Games': frisby.Joi.array().required()
					})
			});
			it ('should refuse an empty body', () => {
				return frisby
					.post(`${base_url}/searchGames`)
					.expect('status', 400)
					.expect('header', 'Content-Type', 'application/json; charset=utf-8')
					.expect('jsonTypes', {
						'cause': frisby.Joi.string().required()
					})
			});
			it ("should refuse a body without 'game'", () => {
				return frisby
					.post(`${base_url}/searchGames`, {
						"__unknown_property__" : "sonic"
					})
					.expect('status', 400)
					.expect('header', 'Content-Type', 'application/json; charset=utf-8')
					.expect('jsonTypes', {
						'cause': frisby.Joi.string().required()
					})
			});
			it ("should refuse an empty 'game'", () => {
				return frisby
					.post(`${base_url}/searchGames`, {
						"game" : " "
					})
					.expect('status', 400)
					.expect('header', 'Content-Type', 'application/json; charset=utf-8')
					.expect('jsonTypes', {
						'cause': frisby.Joi.string().required()
					})
			});
		});
	});
	
	
	describe("Testing 'createGroup'", () => {
		describe('POST /createGroup', () => {
			it ('should return the created group', () => {
				return frisby
					.post(`${base_url}/createGroup`, {
						"name" : "testName" , "description" : "testDescription"
					})
					.expect('status', 200)
					.expect('header', 'Content-Type', 'application/json; charset=utf-8')
					.expect('jsonTypes', {
						'Group': frisby.Joi.string().required()
					})
			});
			it ('should refuse an empty body', () => {
				return frisby
					.post(`${base_url}/createGroup`)
					.expect('status', 400)
					.expect('header', 'Content-Type', 'application/json; charset=utf-8')
					.expect('jsonTypes', {
						'cause': frisby.Joi.string().required()
					})
			});
			it ("should refuse a body without 'name' or 'description'", () => {
				return frisby
					.post(`${base_url}/createGroup`, {
						"__unknown_property__" : "test"
					})
					.expect('status', 400)
					.expect('header', 'Content-Type', 'application/json; charset=utf-8')
					.expect('jsonTypes', {
						'cause': frisby.Joi.string().required()
					})
			});
			it ("should refuse an empty 'name'", () => {
				return frisby
					.post(`${base_url}/createGroup`, {
						"name" : " " , "description" : "testDescription"
					})
					.expect('status', 400)
					.expect('header', 'Content-Type', 'application/json; charset=utf-8')
					.expect('jsonTypes', {
						'cause': frisby.Joi.string().required()
					})
			});
		});
	});
	
	describe("Testing 'listGroups'", () => {
		describe('GET /listGroups', () => {
			it ('should return all groups', () => {
				return frisby
					.get(`${base_url}/listGroups`)
					.expect('status', 200)
					.expect('header', 'Content-Type', 'application/json; charset=utf-8')
					.expect('jsonTypes', {
						'Groups': frisby.Joi.array().required()
					})
			});
		});
	});
	
	describe("Testing 'editGroup'", () => {
		describe('POST /editGroup', () => {
			it ('should return the edited group', () => {
				return frisby
					.post(`${base_url}/editGroup`, {
						"id" : "9s9JgXYB_YMpXeyuwDQh" , "parameter" : "Name" , "edit" : "testNameEdit"
					})
					.expect('status', 200)
					.expect('header', 'Content-Type', 'application/json; charset=utf-8')
					.expect('jsonTypes', {
						'Group': frisby.Joi.object().required()
					})
			});
			it ('should refuse an empty body', () => {
				return frisby
					.post(`${base_url}/editGroup`)
					.expect('status', 400)
					.expect('header', 'Content-Type', 'application/json; charset=utf-8')
					.expect('jsonTypes', {
						'cause': frisby.Joi.string().required()
					})
			});
			it ("should refuse a body without 'id' or 'parmeter' or 'edit'", () => {
				return frisby
					.post(`${base_url}/editGroup`, {
						"__unknown_property__" : "test"
					})
					.expect('status', 400)
					.expect('header', 'Content-Type', 'application/json; charset=utf-8')
					.expect('jsonTypes', {
						'cause': frisby.Joi.string().required()
					})
			});
			it ("should refuse an empty 'id' or 'parameter'", () => {
				return frisby
					.post(`${base_url}/editGroup`, {
						"id" : " " , "parameter" : " " , "edit" : "testNameEdit"
					})
					.expect('status', 400)
					.expect('header', 'Content-Type', 'application/json; charset=utf-8')
					.expect('jsonTypes', {
						'cause': frisby.Joi.string().required()
					})
			});
			it ("should refuse because 'parameter' must be Name / Description", () => {
				return frisby
					.post(`${base_url}/editGroup`, {
						"id" : "9s9JgXYB_YMpXeyuwDQh" , "parameter" : "test" , "edit" : "testNameEdit"
					})
					.expect('status', 400)
					.expect('header', 'Content-Type', 'application/json; charset=utf-8')
					.expect('jsonTypes', {
						'cause': frisby.Joi.string().required()
					})
			});
			it ("should refuse because 'id' non-existent", () => {
				return frisby
					.post(`${base_url}/editGroup`, {
						"id" : "0" , "parameter" : "test" , "edit" : "testNameEdit"
					})
					.expect('status', 400)
					.expect('header', 'Content-Type', 'application/json; charset=utf-8')
					.expect('jsonTypes', {
						'cause': frisby.Joi.string().required()
					})
			});
		});
	});
	
	describe("Testing 'showGroup'", () => {
		describe('POST /showGroup', () => {
			it ('should return the selected group', () => {
				return frisby
					.post(`${base_url}/showGroup`, {
						"id" : "9s9JgXYB_YMpXeyuwDQh"
					})
					.expect('status', 200)
					.expect('header', 'Content-Type', 'application/json; charset=utf-8')
					.expect('jsonTypes', {
						'Group': frisby.Joi.object().required()
					})
			});
			it ('should refuse an empty body', () => {
				return frisby
					.post(`${base_url}/showGroup`)
					.expect('status', 400)
					.expect('header', 'Content-Type', 'application/json; charset=utf-8')
					.expect('jsonTypes', {
						'cause': frisby.Joi.string().required()
					})
			});
			it ("should refuse a body without 'id' ", () => {
				return frisby
					.post(`${base_url}/showGroup`, {
						"__unknown_property__" : "test"
					})
					.expect('status', 400)
					.expect('header', 'Content-Type', 'application/json; charset=utf-8')
					.expect('jsonTypes', {
						'cause': frisby.Joi.string().required()
					})
			});
			it ("should refuse an empty 'id'", () => {
				return frisby
					.post(`${base_url}/showGroup`, {
						"id" : " " 
					})
					.expect('status', 400)
					.expect('header', 'Content-Type', 'application/json; charset=utf-8')
					.expect('jsonTypes', {
						'cause': frisby.Joi.string().required()
					})
			});
			it ("should refuse because 'id' non-existent", () => {
				return frisby
					.post(`${base_url}/showGroup`, {
						"id" : "0"
					})
					.expect('status', 400)
					.expect('header', 'Content-Type', 'application/json; charset=utf-8')
					.expect('jsonTypes', {
						'cause': frisby.Joi.string().required()
					})
			});
		});
	});
	
	describe("Testing 'addGame'", () => {
		describe('POST /addGame', () => {
			it ('should return the selected group with the added game', () => {
				return frisby
					.post(`${base_url}/addGame`, {
						"groupID" : "9s9JgXYB_YMpXeyuwDQh" , "gameID" : "5"
					})
					.expect('status', 200)
					.expect('header', 'Content-Type', 'application/json; charset=utf-8')
					.expect('jsonTypes', {
						'Group': frisby.Joi.object().required()
					})
			});
			it ('should refuse an empty body', () => {
				return frisby
					.post(`${base_url}/addGame`)
					.expect('status', 400)
					.expect('header', 'Content-Type', 'application/json; charset=utf-8')
					.expect('jsonTypes', {
						'cause': frisby.Joi.string().required()
					})
			});
			it ("should refuse a body without 'groupID' or 'gameID'", () => {
				return frisby
					.post(`${base_url}/addGame`, {
						"__unknown_property__" : "test"
					})
					.expect('status', 400)
					.expect('header', 'Content-Type', 'application/json; charset=utf-8')
					.expect('jsonTypes', {
						'cause': frisby.Joi.string().required()
					})
			});
			it ("should refuse an empty 'groupID' or 'gameID'", () => {
				return frisby
					.post(`${base_url}/addGame`, {
						"groupID" : " " , "gameID" : " "
					})
					.expect('status', 400)
					.expect('header', 'Content-Type', 'application/json; charset=utf-8')
					.expect('jsonTypes', {
						'cause': frisby.Joi.string().required()
					})
			});
			it ("should refuse because 'groupID' non-existent", () => {
				return frisby
					.post(`${base_url}/addGame`, {
						"groupID" : "0" , "gameID" : "5"
					})
					.expect('status', 400)
					.expect('header', 'Content-Type', 'application/json; charset=utf-8')
					.expect('jsonTypes', {
						'cause': frisby.Joi.string().required()
					})
			});
			it ("should refuse because game already exists in this group", () => {
				return frisby
					.post(`${base_url}/addGame`, {
						"groupID" : "9s9JgXYB_YMpXeyuwDQh" , "gameID" : "5"
					})
					.expect('status', 400)
					.expect('header', 'Content-Type', 'application/json; charset=utf-8')
					.expect('jsonTypes', {
						'cause': frisby.Joi.string().required()
					})
			});
		});
	});
	
	describe("Testing 'removeGame'", () => {
		describe('POST /removeGame', () => {
			it ('should return the selected group without the removed game', () => {
				return frisby
					.post(`${base_url}/removeGame`, {
						"groupID" : "9s9JgXYB_YMpXeyuwDQh" , "gameID" : "5"
					})
					.expect('status', 200)
					.expect('header', 'Content-Type', 'application/json; charset=utf-8')
					.expect('jsonTypes', {
						'Group': frisby.Joi.object().required()
					})
			});
			it ('should refuse an empty body', () => {
				return frisby
					.post(`${base_url}/removeGame`)
					.expect('status', 400)
					.expect('header', 'Content-Type', 'application/json; charset=utf-8')
					.expect('jsonTypes', {
						'cause': frisby.Joi.string().required()
					})
			});
			it ("should refuse a body without 'groupID' or 'gameID'", () => {
				return frisby
					.post(`${base_url}/removeGame`, {
						"__unknown_property__" : "test"
					})
					.expect('status', 400)
					.expect('header', 'Content-Type', 'application/json; charset=utf-8')
					.expect('jsonTypes', {
						'cause': frisby.Joi.string().required()
					})
			});
			it ("should refuse an empty 'groupID' or 'gameID'", () => {
				return frisby
					.post(`${base_url}/removeGame`, {
						"groupID" : " " , "gameID" : " "
					})
					.expect('status', 400)
					.expect('header', 'Content-Type', 'application/json; charset=utf-8')
					.expect('jsonTypes', {
						'cause': frisby.Joi.string().required()
					})
			});
			it ("should refuse because 'groupID' non-existent", () => {
				return frisby
					.post(`${base_url}/removeGame`, {
						"groupID" : "0" , "gameID" : "5"
					})
					.expect('status', 400)
					.expect('header', 'Content-Type', 'application/json; charset=utf-8')
					.expect('jsonTypes', {
						'cause': frisby.Joi.string().required()
					})
			});
			it ("should refuse because game non-existent in this group", () => {
				return frisby
					.post(`${base_url}/removeGame`, {
						"groupID" : "9s9JgXYB_YMpXeyuwDQh" , "gameID" : "5"
					})
					.expect('status', 400)
					.expect('header', 'Content-Type', 'application/json; charset=utf-8')
					.expect('jsonTypes', {
						'cause': frisby.Joi.string().required()
					})
			});
		});
	});
	
	describe("Testing 'gamesByRating'", () => {
		describe('POST /gamesByRating', () => {
			it ('should return the games of the selected group sorted by rating between the two chosen values', () => {
				return frisby
					.post(`${base_url}/gamesByRating`, {
						"id" : "SGcccnYBsMFcEG1nRI-H" , "min" : "85" , "max" : "90"
					})
					.expect('status', 200)
					.expect('header', 'Content-Type', 'application/json; charset=utf-8')
					.expect('jsonTypes', {
						'Games': frisby.Joi.array().required()
					})
			});
			it ('should refuse an empty body', () => {
				return frisby
					.post(`${base_url}/gamesByRating`)
					.expect('status', 400)
					.expect('header', 'Content-Type', 'application/json; charset=utf-8')
					.expect('jsonTypes', {
						'cause': frisby.Joi.string().required()
					})
			});
			it ("should refuse a body without 'id' or 'min' or 'max'", () => {
				return frisby
					.post(`${base_url}/gamesByRating`, {
						"__unknown_property__" : "test"
					})
					.expect('status', 400)
					.expect('header', 'Content-Type', 'application/json; charset=utf-8')
					.expect('jsonTypes', {
						'cause': frisby.Joi.string().required()
					})
			});
			it ("should refuse an empty 'id' or 'min' or 'max'", () => {
				return frisby
					.post(`${base_url}/gamesByRating`, {
						"id" : " " , "min" : " " , "max" : " "
					})
					.expect('status', 400)
					.expect('header', 'Content-Type', 'application/json; charset=utf-8')
					.expect('jsonTypes', {
						'cause': frisby.Joi.string().required()
					})
			});
			it ("should refuse because 'groupID' non-existent", () => {
				return frisby
					.post(`${base_url}/gamesByRating`, {
						"groupID" : "0" , "min" : "85" , "max" : "90"
					})
					.expect('status', 400)
					.expect('header', 'Content-Type', 'application/json; charset=utf-8')
					.expect('jsonTypes', {
						'cause': frisby.Joi.string().required()
					})
			});
			it ("should refuse because boundaries must be between 0 and 100 and Max must be greater than Min", () => {
				return frisby
					.post(`${base_url}/gamesByRating`, {
						"id" : "SGcccnYBsMFcEG1nRI-H" , "min" : "101" , "max" : "90"
					})
					.expect('status', 400)
					.expect('header', 'Content-Type', 'application/json; charset=utf-8')
					.expect('jsonTypes', {
						'cause': frisby.Joi.string().required()
					})
			});
		});
	});
	
	describe("Testing 'removeGroup'", () => {
		describe('POST /removeGroup', () => {
			it ("should return the message 'Group eliminated'", () => {
				return frisby
					.post(`${base_url}/removeGroup`, {
						"id" : "-c9MgXYB_YMpXeyuljSX" 
					})
					.expect('status', 200)
					.expect('header', 'Content-Type', 'application/json; charset=utf-8')
					.expect('jsonTypes', frisby.Joi.string().required())
			});
			it ('should refuse an empty body', () => {
				return frisby
					.post(`${base_url}/removeGroup`)
					.expect('status', 400)
					.expect('header', 'Content-Type', 'application/json; charset=utf-8')
					.expect('jsonTypes', {
						'cause': frisby.Joi.string().required()
					})
			});
			it ("should refuse a body without 'id'", () => {
				return frisby
					.post(`${base_url}/removeGroup`, {
						"__unknown_property__" : "test"
					})
					.expect('status', 400)
					.expect('header', 'Content-Type', 'application/json; charset=utf-8')
					.expect('jsonTypes', {
						'cause': frisby.Joi.string().required()
					})
			});
			it ("should refuse an empty 'id'", () => {
				return frisby
					.post(`${base_url}/removeGroup`, {
						"id" : " "
					})
					.expect('status', 400)
					.expect('header', 'Content-Type', 'application/json; charset=utf-8')
					.expect('jsonTypes', {
						'cause': frisby.Joi.string().required()
					})
			});
			it ("should refuse because 'id' non-existent", () => {
				return frisby
					.post(`${base_url}/removeGame`, {
						"id" : "0"
					})
					.expect('status', 400)
					.expect('header', 'Content-Type', 'application/json; charset=utf-8')
					.expect('jsonTypes', {
						'cause': frisby.Joi.string().required()
					})
			});
		});
	});
})