'use strict';

var app = angular.module('elyoosApp');

app.controller('ManageBookPageCtrl', require('./controller'));

app.service('BookPageCreateMessageService', require('./services/createMessage'));
