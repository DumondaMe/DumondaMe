'use strict';

var app = angular.module('elyoosApp');
var directive = require('./directive.js');

app.directive(directive.name, directive.directive);

app.factory('Register', require('./services/register'));
