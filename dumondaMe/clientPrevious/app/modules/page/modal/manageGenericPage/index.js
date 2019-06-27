'use strict';

var app = angular.module('elyoosApp');

app.controller('ManageGenericPageCtrl', require('./controller'));

app.service('GenericPageCreateMessageService', require('./services/createMessage'));
