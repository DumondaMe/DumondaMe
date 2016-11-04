'use strict';

var app = angular.module('elyoosApp');

var directive = require('./directive.js');

app.directive(directive.name, directive.directive);

app.service('SelectElementsResponseHandler', require('./services/scrollRequestResponseHandler'));
app.service('SelectElementsCheckBoxHandler', require('./services/checkBoxHandler'));
