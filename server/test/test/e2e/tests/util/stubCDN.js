'use strict';

var sinon = require('sinon');
var cdn = require('../../../../../models/util/cdn');
var Promise = require('bluebird');

var getUrl = sinon.stub(cdn, 'getUrl');
var uploadFile = sinon.stub(cdn, 'uploadFile');
var copyFile = sinon.stub(cdn, 'copyFile');
var deleteFolder = sinon.stub(cdn, 'deleteFolder');
var createFolderRegisterUser = sinon.stub(cdn, 'createFolderRegisterUser');

getUrl.returnsArg(0);
uploadFile.returns(Promise.resolve());
copyFile.returns(Promise.resolve());
deleteFolder.returns(Promise.resolve());
createFolderRegisterUser.returns(Promise.resolve());

module.exports = {
    getUrl: getUrl,
    uploadFile: uploadFile,
    copyFile: copyFile,
    deleteFolder: deleteFolder,
    createFolderRegisterUser: createFolderRegisterUser
};