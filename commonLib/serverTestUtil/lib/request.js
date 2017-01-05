'use strict';

let request = require('supertest-as-promised');
let agent = require('supertest');

let lastUser = [], app;

module.exports = {
    setApplication: function (newApp) {
        app = newApp;
    },
    login: function (user) {
        lastUser.push(user);
        return request(app).post('/api/login').
            send(user).
            then(function (res) {
                let loginAgent = agent.agent(app);
                loginAgent.saveCookies(res);
                return loginAgent;
            });
    },
    logout: function () {
        let user = lastUser.pop();
        if (user) {
            return request(app).post('/api/logout').
                send(user);
        }
    },
    post: function (api, data, agent, pathToFile) {
        let req = request(app).post(api);
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
        let req = request(app).post(api);
        if (agent) {
            agent.attachCookies(req);
        }
        req.set('X-HTTP-Method-Override', 'DELETE');
        return req.send(data);
    },
    get: function (api, agent) {
        let req = request(app).get(api);
        if (agent) {
            agent.attachCookies(req);
        }
        return req;
    },
    getWithData: function (api, data, agent) {
        let req = request(app).get(api);
        if (agent) {
            agent.attachCookies(req);
        }
        req.query(data);
        return req.send();
    }
};