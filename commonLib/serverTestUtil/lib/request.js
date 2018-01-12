'use strict';

let request = require('supertest');
let bluebird = require('bluebird');
bluebird.promisifyAll(request);

let lastUser = [], cookies, app;

module.exports = {
    setApplication: function (newApp) {
        app = newApp;
    },
    login: function (user) {
        return request(app).post('/api/login')
            .set('authorization', 'fiengib458ckeEr9dicv')
            .send(user).then(function (res) {
                cookies = res.headers['set-cookie'].pop().split(';')[0];
                lastUser.push({user: user, cookies: cookies});
            });
    },
    logout: function () {
        let user = lastUser.pop();
        if (user) {
            if(lastUser.length > 0) {
                cookies = lastUser[lastUser.length - 1].cookies;
            } else {
                cookies = null;
            }
            return request(app).post('/api/logout')
                .set('authorization', 'fiengib458ckeEr9dicv').send(user.user);
        }
    },
    post: function (api, data, pathToFile) {
        let req = request(app).post(api);
        if (cookies) {
            req.cookies = cookies;
        }
        if (pathToFile) {
            req.attach('file', pathToFile);
            req.field('model', JSON.stringify(data));
            return req.set('authorization', 'fiengib458ckeEr9dicv').send();
        }
        return req.set('authorization', 'fiengib458ckeEr9dicv').send(data);
    },

    put: function (api, data, pathToFile) {
        let req = request(app).put(api);
        if (cookies) {
            req.cookies = cookies;
        }
        if (pathToFile) {
            req.attach('file', pathToFile);
            req.field('model', JSON.stringify(data));
            return req.set('authorization', 'fiengib458ckeEr9dicv').send();
        }
        return req.set('authorization', 'fiengib458ckeEr9dicv').send(data);
    },
    del: function (api, data) {
        let req = request(app).delete(api);
        if (cookies) {
            req.cookies = cookies;
        }
        return req.set('authorization', 'fiengib458ckeEr9dicv').send(data);
    },
    get: function (api, data) {
        let req = request(app).get(api);
        if (cookies) {
            req.cookies = cookies;
        }
        if(data) {
            req.query(data);
        }
        return req.set('authorization', 'fiengib458ckeEr9dicv').send();
    }
};