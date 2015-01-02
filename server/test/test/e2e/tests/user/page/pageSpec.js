/*
 'use strict';

 var app = require('../../../../../../server');
 var libUser = require('../../../../../../lib/user')();
 var users = require('../../util/user');
 var requestHandler = require('../../util/request');
 var should = require('chai').should();
 var db = require('../../util/db');

 describe('Integration Tests for user pages', function () {

 var userId;

 beforeEach(function () {

 libUser.removeFromCache('user@irgendwo.ch');

 return db.clearDatabase().then(function () {
 return db.insertData('users', 'user',
 {
 email: 'user@irgendwo.ch',
 password: '1234',
 forename: 'Hans',
 surname: 'Muster'
 });
 }).then(function (response) {
 userId = response._id;

 return db.insertData('pages', 'page',
 {
 category: 'book',
 titles: {
 title: 'Hallo'
 },
 administrators: {
 id: userId
 }
 });
 }).then(function () {
 return db.insertData('pages', 'page',
 {
 category: 'praxis',
 titles: {
 title: 'Hallo2'
 },
 administrators: {
 id: userId
 }
 });
 }).then(function () {
 return db.insertData('pages', 'page',
 {
 category: 'shop',
 titles: {
 title: 'Hallo3'
 },
 administrators: {
 id: 1
 }
 });
 }).then(function () {
 return db.indicesRefresh('users');
 }).then(function () {
 return db.indicesRefresh('pages');
 });
 });

 afterEach(function (done) {
 requestHandler.logout(done);
 });

 it('Get User Data when logged in - Return a 200', function () {
 return requestHandler.login(users.validUser).then(function (agent) {
 return requestHandler.get('/api/user/page', agent);
 }).then(function (res) {
 res.status.should.equal(200);
 res.body.data.length.should.equal(2);
 });
 });

 it('Post a new book Page - Return a 200', function () {
 var requestData = {
 titles: [
 {
 title: "Deutscher Test",
 description: "Irgenwas",
 language: "german"
 },
 {
 title: "English Test",
 description: "Something",
 language: "english"
 }
 ],
 author: 'Hans Mueller'
 };

 return requestHandler.login(users.validUser).then(function (agent) {
 return requestHandler.post('/api/user/page/book', requestData, agent);
 }).then(function (res) {
 res.status.should.equal(200);
 return db.search('pages', 'page', "author:'Hans Mueller'");
 }).then(function (page) {
 page.data.length.should.equal(1);
 page.data[0].administrators.length.should.equal(1);
 page.data[0].titles.should.eql(requestData.titles);
 page.data[0].author.should.equals(requestData.author);
 });
 });

 it('Post a new miscellaneous Page - Return a 200', function () {
 var requestData = {
 link: 'http://www.imlicht.ch/',
 category: 'store',
 titles: [
 {
 title: "Buchhandlung im Licht AG",
 description: "Spirituelle Buchhandlung",
 language: "german"
 }
 ],
 author: 'Hans Mueller',
 street: 'Seefeldstrasse 50',
 postalCode: '8008',
 country: 'Schweiz'
 };

 return requestHandler.login(users.validUser).then(function (agent) {
 return requestHandler.post('/api/user/page/miscellaneous', requestData, agent);
 }).then(function (res) {
 res.status.should.equal(200);
 return db.search('pages', 'page', "author:'Hans Mueller'");
 }).then(function (page) {
 page.data.length.should.equal(1);
 page.data[0].administrators.length.should.equal(1);
 page.data[0].titles.should.eql(requestData.titles);
 page.data[0].author.should.equals(requestData.author);
 page.data[0].link.should.equals(requestData.link);
 page.data[0].category.should.equals(requestData.category);
 page.data[0].street.should.equals(requestData.street);
 page.data[0].postalCode.should.equals(requestData.postalCode);
 page.data[0].country.should.equals(requestData.country);
 });
 });
 });
 */
