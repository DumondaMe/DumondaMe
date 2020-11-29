'use strict';

const Promise = require('bluebird');
const fs = require('fs');
const path = require('path');
const rimraf = require('rimraf');

const CDN_FOLDER = 'dockerCompose/static/cdn/'
const CDN_START_URL = 'cdn/'

const createDirectory = function (pathToFile) {
    let pathDirectory = path.dirname(pathToFile);
    if (!fs.existsSync(pathDirectory)) {
        fs.mkdirSync(pathDirectory, {recursive: true});
    }
};

const copyFile = async function (source, destination) {

    source = path.join(process.env.BASE_DIR, CDN_FOLDER, source);
    destination = path.join(process.env.BASE_DIR, CDN_FOLDER, destination);
    createDirectory(source);
    createDirectory(destination);
    fs.copyFileSync(source, destination);
};

const getSignedUrl = async function (path) {
    return process.env.PUBLIC_IMAGE_BASE_URL + CDN_START_URL + path;
};

const uploadBuffer = async function (buffer, key) {
    let filePath = path.join(process.env.BASE_DIR, CDN_FOLDER, key);
    createDirectory(filePath);
    fs.writeFileSync(filePath, buffer);
};

const getPublicUrl = function (path) {
    return process.env.PUBLIC_IMAGE_BASE_URL + CDN_START_URL + path;
};

const deleteFolder = async function (folderName) {
    let directory = path.join(process.env.BASE_DIR, CDN_FOLDER, folderName)
    rimraf.sync(directory); //@Todo: Replace in node version < 10 with fs recursive.
};

const createFolderRegisterUser = async function (userId) {
    await Promise.all([copyFile('profileImage/default/profile.jpg', `profileImage/${userId}/profile.jpg`),
        copyFile('profileImage/default/profilePreview.jpg', `profileImage/${userId}/profilePreview.jpg`),
        copyFile('profileImage/default/thumbnail.jpg', `profileImage/${userId}/thumbnail.jpg`)]);
};

const getObject = async function (path) {
    let filePath = path.join(process.env.BASE_DIR, CDN_FOLDER, key);
    return fs.readFileSync(filePath);
};

module.exports = {
    getSignedUrl,
    getPublicUrl,
    uploadBuffer,
    deleteFolder,
    copyFile,
    createFolderRegisterUser,
    getObject
};
