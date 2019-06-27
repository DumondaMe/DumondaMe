'use strict';

var app = angular.module('elyoosApp');
var fileModel = require('./fileModel.js');

app.service('fileUpload', require('./services/fileUpload'));
app.service('CheckFileFormat', require('./services/checkFileFormat'));
app.service('FileReaderLoadImage', require('./services/fileReaderLoadImage'));

app.factory('FileReader', require('./services/fileReader'));
app.service('FileReaderUtil', require('./services/fileReaderUtil'));

app.directive(fileModel.name, fileModel.directive);