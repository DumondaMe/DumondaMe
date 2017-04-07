'use strict';

var app = angular.module('elyoosApp');
var directive = require('./directive.js');

app.directive(directive.name, directive.directive);

app.service('CheckGroupNameService', require('./services/checkGroupName'));

app.controller('AddGroupController', require('./controller'));
