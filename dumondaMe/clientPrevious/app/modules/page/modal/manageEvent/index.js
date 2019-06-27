'use strict';

var app = angular.module('elyoosApp');

app.controller('ManageEventCtrl', require('./controller'));

app.service('CreateEventMessageService', require('./services/createMessage'));
