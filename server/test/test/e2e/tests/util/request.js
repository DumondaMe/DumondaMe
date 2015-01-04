'use strict';

var app = require('../../../../../server');
var request = require('supertest-as-promised');
var agent = require('supertest').agent(app);

var lastUser;

module.exports = {
    login: function (user) {
        lastUser = user;
        return request(app).post('/api/login').
            send(user).
            then(function (res) {
                agent.saveCookies(res);
                return agent;
            });
    },
    logout: function (done) {
        if (lastUser) {
            request(app).post('/api/logout').
                send(lastUser)
                .then(function () {
                    done();
                });
        } else {
            done();
        }
    },
    post: function (api, data, agent) {
        var req = request(app).post(api);
        if (agent) {
            agent.attachCookies(req);
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
        var req = request(app).get(api), key;
        if (agent) {
            agent.attachCookies(req);
        }
        req.query(data);
        return req.send();
    }
};