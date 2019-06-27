'use strict';

var app = angular.module('elyoosApp');
var directive = require('./directive.js');

app.service('IsAuth', require('./isAuth'));
app.service('CheckLoginStateParamsContainer', require('./paramsContainer'));

app.directive(directive.name, directive.directive);
