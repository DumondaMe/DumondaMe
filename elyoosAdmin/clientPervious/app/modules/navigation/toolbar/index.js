'use strict';

var app = angular.module('elyoosApp');
var directive = require('./directive.js');

app.service('ToolbarService', require('./services/toolbarService'));

app.directive(directive.name, directive.directive);
