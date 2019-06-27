'use strict';

var app = angular.module('elyoosApp');

app.service('EventDetail', require('./services/eventDetail'));

app.controller('InfoEventCtrl', require('./controller'));
