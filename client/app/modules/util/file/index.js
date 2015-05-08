'use strict';

var app = require('angular').module('elyoosApp');
var fileModel = require('./fileModel.js');

app.service('fileUpload', require('./fileUpload'));

app.factory('FileReader', require('./fileReader'));

app.controller('FileCtrl', require('./fileCtrl'));

app.directive(fileModel.name, fileModel.directive);