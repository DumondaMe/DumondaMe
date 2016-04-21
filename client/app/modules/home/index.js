'use strict';

var app = angular.module('elyoosApp');
var directive = require('./directive.js');

app.directive(directive.name, directive.directive);

app.factory('Home', require('./services/home'));
app.factory('Blog', require('./services/blog'));
app.factory('SearchHome', require('./services/searchHome'));

app.service('HomeScrollRequest', require('./services/scrollRequest'));
