'use strict';

var app = angular.module('elyoosApp');
var directive = require('./directive.js');

app.directive(directive.name, directive.directive);
app.directive(directive.nameContent, directive.directiveContent);

app.service('PrivacySettingService', require('./services/privacySetting'));