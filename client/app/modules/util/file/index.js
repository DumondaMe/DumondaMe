'use strict';

var app = require('angular').module('elyoosApp');

var fileModel = require('./fileModel.js');

app.directive(fileModel.name, fileModel.directive);

app.service('fileUpload', require('./fileUpload'));