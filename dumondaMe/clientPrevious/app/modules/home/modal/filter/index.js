'use strict';

var app = angular.module('elyoosApp');

app.controller('HomeScreenFilterCtrl', require('./controller'));

app.service('HomeScreenFilter', require('./services/homeScreenFilter'));