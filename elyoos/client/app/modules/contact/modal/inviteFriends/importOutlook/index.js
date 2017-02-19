'use strict';

var app = angular.module('elyoosApp');
var directive = require('./directive.js');

app.directive(directive.name, directive.directive);

app.service('ImportOutlookCodeParser', require('./services/codeParser'));
app.factory('ImportOutlookContacts', require('./services/importOutlookContacts'));
