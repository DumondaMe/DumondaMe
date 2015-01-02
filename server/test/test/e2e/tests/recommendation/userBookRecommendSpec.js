/*
 'use strict';

 var app = require('../../../../../server');
 var users = require('../util/user');
 var db = require('../util/db');
 var requestHandler = require('../util/request');
 var should = require('chai').should();

 describe('Integration Tests user book recommendations', function () {

 var bookRecommendation = {
 title: 'Ein neues Buch',
 author: 'Roger Waldvogel',
 category: 'book',
 ratingPositive: true,
 comment: 'Super Buch'
 }, userId;

 beforeEach(function () {
 return db.clearDatabase().then(function () {
 return db.insertData('users', 'user',
 {
 email: 'user@irgendwo.ch',
 password: '1234',
 forename: 'user',
 surname: 'Meier',
 birthday: '1982-06-06',
 country: 'Schweiz',
 female: true
 });
 }).then(function (response) {
 //insert all Recommendations
 userId = response._id;

 return db.insertData('users', 'recommendation',
 {
 ratingPositive: false,
 title: 'Ha ha',
 link: 'www.irgendwas.com',
 category: 'video',
 userId: 1
 });
 }).then(function () {
 return db.indicesRefresh('users');
 });
 });

 afterEach(function (done) {
 requestHandler.logout(done);
 });


 it('Add a new book recommendation. Modify book recommendation - Return always 200', function () {

 var requestAgent, bookRecommendation2 = {};

 return requestHandler.login(users.validUser).then(function (agent) {
 requestAgent = agent;
 return requestHandler.post('/api/user/profile/recommendation/book', bookRecommendation, requestAgent);
 }).then(function (res) {
 res.status.should.equal(200);
 return db.getById('users', 'recommendation', res.body.id);
 }).then(function (recommendation) {
 bookRecommendation.category.should.equals(recommendation._source.category);
 bookRecommendation.author.should.equals(recommendation._source.author);
 bookRecommendation.title.should.equals(recommendation._source.title);
 bookRecommendation.comment.should.equals(recommendation._source.comment);
 bookRecommendation.ratingPositive.should.equals(recommendation._source.ratingPositive);

 bookRecommendation2.author = 'Roger2';
 bookRecommendation2.title = 'Ein anderes Buch';
 bookRecommendation2.comment = 'Schlecht';
 bookRecommendation2.ratingPositive = false;
 bookRecommendation2.id = recommendation._id;
 return requestHandler.post('/api/user/profile/recommendation/book', bookRecommendation2, requestAgent);
 }).then(function (res) {
 res.status.should.equal(200);
 return db.getById('users', 'recommendation', bookRecommendation2.id);
 }).then(function (recommendation) {
 'book'.should.equals(recommendation._source.category);
 bookRecommendation2.author.should.equals(recommendation._source.author);
 bookRecommendation2.title.should.equals(recommendation._source.title);
 bookRecommendation2.comment.should.equals(recommendation._source.comment);
 bookRecommendation2.ratingPositive.should.equals(recommendation._source.ratingPositive);
 });
 });

 it('Modify a book recommendation of an other user - Return a 400', function () {

 var requestAgent;

 return requestHandler.login(users.validUser).then(function (agent) {
 requestAgent = agent;
 return db.search('users', 'recommendation', 'userId: 1');
 }).then(function (recommendation) {
 should.exist(recommendation);
 bookRecommendation.id = recommendation.data[0].id;
 return requestHandler.post('/api/user/profile/recommendation/book', bookRecommendation, requestAgent);
 }).then(function (res) {
 res.status.should.equal(400);
 return db.search('users', 'recommendation', 'userId: 1');
 }).then(function (recommendation) {
 recommendation.data.should.with.length(1);
 });
 });

 it('Delete a book recommendation - Return a 200', function () {

 var requestAgent,
 deleteBookRecommendation = {};

 bookRecommendation = {
 title: 'Ein neues Buch',
 author: 'Roger Waldvogel',
 ratingPositive: true,
 comment: 'Super Buch'
 };

 return requestHandler.login(users.validUser).then(function (agent) {
 requestAgent = agent;
 return requestHandler.post('/api/user/profile/recommendation/book', bookRecommendation, requestAgent);
 }).then(function (res) {
 res.status.should.equal(200);
 return db.getById('users', 'recommendation', res.body.id);
 }).then(function (recommendation) {
 should.exist(recommendation);
 deleteBookRecommendation.id = recommendation._id;
 return requestHandler.del('/api/user/profile/recommendation/book', deleteBookRecommendation, requestAgent);
 }).then(function (res) {
 res.status.should.equal(200);
 return db.search('users', 'recommendation', '_id:' + deleteBookRecommendation.id);
 }).then(function (recommendation) {
 recommendation.data.should.with.length(0);
 });
 });

 it('Delete a book recommendation of an other user - Return a 400', function () {

 var requestAgent,
 deleteBookRecommendation = {};

 return requestHandler.login(users.validUser).then(function (agent) {
 requestAgent = agent;
 return db.search('users', 'recommendation', 'userId: 1');
 }).then(function (recommendation) {
 should.exist(recommendation);
 deleteBookRecommendation.id = recommendation.data[0].id;
 return requestHandler.del('/api/user/profile/recommendation/book', deleteBookRecommendation, requestAgent);
 }).then(function (res) {
 res.status.should.equal(400);
 return db.search('users', 'recommendation', 'userId: 1');
 }).then(function (recommendation) {
 recommendation.data.should.with.length(1);
 });
 });
 });*/
