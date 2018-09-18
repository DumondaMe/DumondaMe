'use strict';

let moment = require('moment');
let requestGetFunction;
let executeGetRequest = function (req, res) {
    return requestGetFunction(req, res);
};
let requestPostFunction;
let executePostRequest = function (req, res) {
    return requestPostFunction(req, res);
};
let requestDeleteFunction;
let executeDeleteRequest = function (req, res) {
    return requestDeleteFunction(req, res);
};
let requestMock = {
    get: function (path, executeTestFunctionWithoutAuthentication, executeTestFunction) {
        if (executeTestFunction) {
            requestGetFunction = executeTestFunction;
        } else {
            requestGetFunction = executeTestFunctionWithoutAuthentication;
        }
    },
    post: function (path, executeTestFunctionWithoutAuthentication, executeTestFunction) {
        if (executeTestFunction) {
            requestPostFunction = executeTestFunction;
        } else {
            requestPostFunction = executeTestFunctionWithoutAuthentication;
        }
    },
    delete: function (path, isAuthenticated, executeTestFunction) {
        requestDeleteFunction = executeTestFunction;
    }
};

let getResponse = function () {
    let statusResponse = {
        json: function (args) {
        },
        end: function () {
        },
        send: function () {
        }
    }, res = {
        send: function () {
        }, json: function () {
        }, setHeader: function () {
        }, end: function () {
        }, cookie: function () {
        }, sendFile: function () {
        }, status: function (args) {
            return statusResponse;
        }
    };
    return res;
};

let getRequest = function () {
    let req = {
        user: {id: 1},
        session: {cookie: {_expires: moment().valueOf() + 999999}},
        files: { file: {path: 'test'}}
    };
    req.body = function () {
    };
    req.query = {};
    req.logIn = function () {
    };
    return req;
};

module.exports = {
    executeGetRequest: executeGetRequest,
    executePostRequest: executePostRequest,
    executeDeleteRequest: executeDeleteRequest,
    requestMock: requestMock,
    res: getResponse(),
    req: getRequest()
};