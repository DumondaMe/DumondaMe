'use strict';

let sinon = require('sinon');
let Promise = require('bluebird');

let getUrl;
let uploadFile;
let copyFile;
let deleteFolder;
let createFolderRegisterUser;

module.exports = function () {
    return {
        stub: function (cdn) {
            getUrl = sinon.stub(cdn, 'getUrl');
            uploadFile = sinon.stub(cdn, 'uploadFile');
            copyFile = sinon.stub(cdn, 'copyFile');
            deleteFolder = sinon.stub(cdn, 'deleteFolder');
            createFolderRegisterUser = sinon.stub(cdn, 'createFolderRegisterUser');

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