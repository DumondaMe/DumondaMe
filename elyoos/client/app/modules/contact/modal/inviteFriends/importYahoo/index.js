'use strict';

var app = angular.module('elyoosApp');
var directive = require('./directive.js');

app.directive(directive.name, directive.directive);

app.service('ImportYahooCodeParser', require('./services/codeParser'));
app.factory('ImportYahooContacts', require('./services/importYahooContacts'));
