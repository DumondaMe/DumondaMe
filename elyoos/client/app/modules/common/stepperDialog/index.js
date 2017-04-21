'use strict';

var app = angular.module('elyoosApp');
var directive = require('./directive.js');

app.directive(directive.name, directive.directive);

app.service('StepperDialogCommandHandler', require('./services/commandHandler'));
app.service('StepperDialogScrollRequest', require('./services/scrollService'));
app.service('StepperDialogSteps', require('./services/steps'));
