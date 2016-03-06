'use strict';

var app = angular.module('elyoosApp');
var directive = require('./directive.js');

app.service('PrivacyPublicCheckService', require('./services/privacyPublicCheck'));

app.directive(directive.name, directive.directive);