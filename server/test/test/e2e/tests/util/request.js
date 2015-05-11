'use strict';

var app = require('../../../../../server');
var request = require('supertest-as-promised');
var agent = require('supertest');

var lastUser = [];

module.exports = {
    login: function (user) {
        lastUser.push(user);
        return request(app).post('/api/login').
            send(user).
            then(function (res) {
                var loginAgent = agent.agent(app);
                loginAgent.saveCookies(res);
                return loginAgent;
            });
    },
    logout: function () {
        var user = lastUser.pop();
        if (user) {
            return request(app).post('/api/logout').
                send(user);
        }
    },
    post: function (api, data, agent, pathToFile) {
        var req = request(app).post(api);
        if (agent) {
            agent.attachCookies(req);
        }
        if (pathToFile) {
            req.attach('file', pathToFile);
            req.field('model', JSON.stringify(data));
            return req.send();
        }
        return req.send(data);
    },
    del: function (api, data, agent) {
        var req = request(app).post(api);
        if (agent) {
            agent.attachCookies(req);
        }
        req.set('X-HTTP-Method-Override', 'DELETE');
        return req.send(data);
    },
    get: function (api, agent) {
        var req = request(app).get(api);
        if (agent) {
            agent.attachCookies(req);
        }
        return req;
    },
    getWithData: function (api, data, agent) {
        var req = request(app).get(api);
        if (agent) {
            agent.attachCookies(req);
        }
        req.query(data);
        return req.send();
    }
};