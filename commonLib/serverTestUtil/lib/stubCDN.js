'use strict';

let sinon = require('sinon');
let Promise = require('bluebird');

let getUrl;
let uploadFile;
let copyFile;
let deleteFolder;
let createFolderRegisterUser;

let stubFunction = function (cdn, name) {
    if (cdn.hasOwnProperty(name)) {
        return sinon.stub(cdn, name);
    }
    return {
        returns: function () {
        }
    };
};

module.exports = function () {
    return {
        stub: function (cdn) {
            getUrl = stubFunction(cdn, 'getUrl');
            uploadFile = stubFunction(cdn, 'uploadFile');
            copyFile = stubFunction(cdn, 'copyFile');
            deleteFolder = stubFunction(cdn, 'deleteFolder');
            createFolderRegisterUser = stubFunction(cdn, 'createFolderRegisterUser');

            getUrl.returnsArg(0);
            uploadFile.returns(Promise.resolve());
            copyFile.returns(Promise.resolve());
            deleteFolder.returns(Promise.resolve());
            createFolderRegisterUser.returns(Promise.resolve());
        },
        getUrl: getUrl,
        uploadFile: uploadFile,
        copyFile: copyFile,
        deleteFolder: deleteFolder,
        createFolderRegisterUser: createFolderRegisterUser
    };
};