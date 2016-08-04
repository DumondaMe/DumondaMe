'use strict';

var app = angular.module('elyoosApp');

app.controller('RegisterCtrl', require('./controller'));

app.factory('Register', require('./services/register'));
