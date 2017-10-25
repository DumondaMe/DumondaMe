'use strict';

var app = angular.module('elyoosApp');
var directive = require('./directive.js');

app.service('SyncTc', require('./services/syncTC'));

app.directive(directive.name, directive.directive);