'use strict';

var requestGetFunction;
var executeGetRequest = function (req, res) {
    return requestGetFunction(req, res);
};
var requestPostFunction;
var executePostRequest = function (req, res) {
    return requestPostFunction(req, res);
};
var requestDeleteFunction;
var executeDeleteRequest = function (req, res) {
    return requestDeleteFunction(req, res);
};
var requestMock = {
    get: function (path, executeTestFunctionWithoutAuthentication, executeTestFunction) {
        if (executeTestFunction) {
            requestGetFunction = executeTestFunction;
        } else {
            requestGetFunction = executeTestFunctionWithoutAuthentication;
        }
    },
    post: function (path, isAuthenticated, executeTestFunction) {
        requestPostFunction = executeTestFunction;
    },
    delete: function (path, isAuthenticated, executeTestFunction) {
        requestDeleteFunction = executeTestFunction;
    }
};
var statusResponse = {
    json: function (args) {
    },
    end: function () {
    }
};
var res = {
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
var req = {user: {id: 1}};
req.body = function () {
};

module.exports = {
    executeGetRequest: executeGetRequest,
    executePostRequest: executePostRequest,
    executeDeleteRequest: executeDeleteRequest,
    requestMock: requestMock,
    res: res,
    req: req
};