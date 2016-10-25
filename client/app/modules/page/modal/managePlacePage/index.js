'use strict';

var app = angular.module('elyoosApp');

app.controller('ManagePlacePageCtrl', require('./controller'));

app.service('PlacePageCreateMessageService', require('./services/createMessage'));
