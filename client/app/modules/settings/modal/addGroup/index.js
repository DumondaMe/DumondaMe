'use strict';

var app = angular.module('elyoosApp');

app.service('CheckGroupNameService', require('./services/checkGroupName'));

app.controller('AddGroupController', require('./controller'));
