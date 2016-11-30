'use strict';

var app = angular.module('elyoosApp');
var directive = require('./directive.js');

app.service('ModifyGroupMessageService', require('./services/modifyGroupMessage'));
app.service('ProfileVisibleHandlerService', require('./services/profileVisibleHandler'));

app.directive(directive.name, directive.directive);
