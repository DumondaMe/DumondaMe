/*
 'use strict';

 var app = require('../../../../../server');
 var users = require('../util/user');
 var db = require('../util/db');
 var requestHandler = require('../util/request');
 var should = require('chai').should();

 describe('Integration Tests user link recommendation', function () {

 var linkRecommendation = {
 title: 'Ein neuer Link',
 link: 'www.roger.ch',
 category: 'video',
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
 ratingPositive: true,
 title: 'Ha ha',
 author: 'Nelson',
 category: 'book',
 userId: response._id
 })
 .then(function () {
 return db.insertData('users', 'recommendation',
 {
 ratingPositive: false,
 title: 'Ha ha',
 link: 'www.irgendwas.com',
 category: 'video',
 userId: 1
 });
 });
 }).then(function () {
 return db.indicesRefresh('users');
 });
 });

 afterEach(function (done) {
 requestHandler.logout(done);
 });

 it('Add a new link recommendation. Modify link recommendation - Return always 200', function () {

 var requestAgent, linkRecommendation2 = {};

 return requestHandler.login(users.validUser).then(function (agent) {
 requestAgent = agent;
 return requestHandler.post('/api/user/profile/recommendation/link', linkRecommendation, requestAgent);
 }).then(function (res) {
 res.status.should.equal(200);
 return db.getById('users', 'recommendation', res.body.id);
 }).then(function (recommendation) {
 linkRecommendation.category.should.equals(recommendation._source.category);
 linkRecommendation.link.should.equals(recommendation._source.link);
 linkRecommendation.title.should.equals(recommendation._source.title);
 linkRecommendation.comment.should.equals(recommendation._source.comment);
 linkRecommendation.ratingPositive.should.equals(recommendation._source.ratingPositive);

 linkRecommendation2.link = 'www.google.ch';
 linkRecommendation2.title = 'Ein anderer Link';
 linkRecommendation2.comment = 'Schlecht';
 linkRecommendation2.ratingPositive = false;
 linkRecommendation2.category = 'education';
 linkRecommendation2.id = recommendation._id;
 return requestHandler.post('/api/user/profile/recommendation/link', linkRecommendation2, requestAgent);
 }).then(function (res) {
 res.status.should.equal(200);
 return db.getById('users', 'recommendation', linkRecommendation2.id);
 }).then(function (recommendation) {
 linkRecommendation2.category.should.equals(recommendation._source.category);
 linkRecommendation2.link.should.equals(recommendation._source.link);
 linkRecommendation2.title.should.equals(recommendation._source.title);
 linkRecommendation2.comment.should.equals(recommendation._source.comment);
 linkRecommendation2.ratingPositive.should.equals(recommendation._source.ratingPositive);
 });
 });

 it('Modify a link recommendation of an other user - Return a 400', function () {

 var requestAgent;

 return requestHandler.login(users.validUser).then(function (agent) {
 requestAgent = agent;
 return db.search('users', 'recommendation', 'userId: 1');
 }).then(function (recommendation) {
 should.exist(recommendation);
 linkRecommendation.id = recommendation.data[0].id;
 return requestHandler.post('/api/user/profile/recommendation/link', linkRecommendation, requestAgent);
 }).then(function (res) {
 res.status.should.equal(400);
 return db.search('users', 'recommendation', 'userId: 1');
 }).then(function (recommendation) {
 recommendation.data.should.with.length(1);
 });
 });


 it('Delete a link recommendation - Return a 200', function () {

 var requestAgent,
 deleteLinkRecommendation = {};

 linkRecommendation = {
 title: 'Ein neuer Link',
 link: 'www.roger.ch',
 category: 'video',
 ratingPositive: true,
 comment: 'Super Buch'
 };

 return requestHandler.login(users.validUser).then(function (agent) {
 requestAgent = agent;
 return requestHandler.post('/api/user/profile/recommendation/link', linkRecommendation, requestAgent);
 }).then(function (res) {
 res.status.should.equal(200);
 return db.getById('users', 'recommendation', res.body.id);
 }).then(function (recommendation) {
 should.exist(recommendation);
 deleteLinkRecommendation.id = recommendation._id;
 return requestHandler.del('/api/user/profile/recommendation/link', deleteLinkRecommendation, requestAgent);
 }).then(function (res) {
 res.status.should.equal(200);
 return db.search('users', 'recommendation', '_id:' + deleteLinkRecommendation.id);
 }).then(function (recommendation) {
 recommendation.data.should.with.length(0);
 });
 });

 it('Delete a link recommendation of an other user - Return a 400', function () {

 var requestAgent,
 deleteLinkRecommendation = {};

 return requestHandler.login(users.validUser).then(function (agent) {
 requestAgent = agent;
 return db.search('users', 'recommendation', 'userId: 1');
 }).then(function (recommendation) {
 should.exist(recommendation);
 deleteLinkRecommendation.id = recommendation.data[0].id;
 return requestHandler.del('/api/user/profile/recommendation/link', deleteLinkRecommendation, requestAgent);
 }).then(function (res) {
 res.status.should.equal(400);
 return db.search('users', 'recommendation', 'userId: 1');
 }).then(function (recommendation) {
 recommendation.data.should.with.length(1);
 });
 });
 });
 */
