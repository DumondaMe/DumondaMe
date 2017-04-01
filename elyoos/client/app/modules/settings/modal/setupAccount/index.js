'use strict';

var app = angular.module('elyoosApp');

app.controller('InitialTutorialController', require('./controller'));

app.factory('FinishSetupAccount', require('./services/finishSetupAccount'));
