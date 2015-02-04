'use strict';

var app = require('angular').module('elyoosApp');
var fileModel = require('./fileModel.js');

app.directive(fileModel.name, fileModel.directive);

app.controller('UploadFileCtrl', require('./uploadFileCtrl'));

app.service('fileUpload', require('./fileUpload'));

app.factory('FileReader', require('./fileReader'));