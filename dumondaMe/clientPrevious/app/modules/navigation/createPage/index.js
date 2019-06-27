'use strict';

var app = angular.module('elyoosApp');

app.controller('CreatePageNavCtrl', require('./controller'));

app.service('CreatePageSelectedPages', require('./services/selectedPage'));