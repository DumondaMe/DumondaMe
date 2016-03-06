'use strict';

var app = angular.module('elyoosApp');
var directive = require('./directive.js');

app.service('ModifyGroupMessageService', require('./services/modifyGroupMessage'));

app.directive(directive.name, directive.directive);
