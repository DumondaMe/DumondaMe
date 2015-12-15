'use strict';

var app = angular.module('elyoosApp');
var directive = require('./directive.js');

app.service('IsAuth', require('./isAuth'));

app.directive(directive.name, directive.directive);
