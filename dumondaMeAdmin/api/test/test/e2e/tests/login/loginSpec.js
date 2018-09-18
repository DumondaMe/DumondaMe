'use strict';

const app = require('../../../../../../server');
const request = require('supertest');
const users = require('dumonda-me-server-test-util').user;
const dbDsl = require('dumonda-me-server-test-util').dbDSL;

describe('Integration Tests Login', function () {

    beforeEach(async function () {
        await dbDsl.init(1);
    });

    it('Login - Return 400 when invalid username', async function () {
        await dbDsl.sendToDb();
        await request(app).post('/api/login').send(users.invalidUsername).expect(400);
    });
    it('Login - Return 400 when invalid password', async function () {
        await dbDsl.sendToDb();
        await request(app).post('/api/login').send(users.invalidPassword).expect(400);
    });

    it('Login - Return 400 because user is not ElyoosAdmin', async function () {
        await dbDsl.sendToDb();
        await request(app).post('/api/login').send(users.validUser).expect(400);
    });

    it('Login - Return 200', async function () {
        dbDsl.setUserIsDumondaMeAdmin('1');
        await dbDsl.sendToDb();
        await request(app).post('/api/login').send(users.validUser).expect(200);
    });

    it('Logout - Return 200', async function () {
        await dbDsl.sendToDb();
        await request(app).post('/api/logout').send({}).expect(200);
    });
});