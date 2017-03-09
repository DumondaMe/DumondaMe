'use strict';

var app = angular.module('elyoosApp');
var directive = require('./directive.js');

app.directive(directive.name, directive.directive);

app.service('ImportGmailCodeParser', require('./services/codeParser'));
app.factory('ImportGmailContacts', require('./services/importGmailContacts'));
