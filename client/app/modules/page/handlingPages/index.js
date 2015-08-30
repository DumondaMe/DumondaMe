'use strict';

var app = angular.module('elyoosApp');
var directive = require('./directive.js');

app.directive(directive.name, directive.directive);

app.service('PageHandlingState', require('./services/stateHandler'));
app.service('PageHandlingUpload', require('./services/uploadPage'));