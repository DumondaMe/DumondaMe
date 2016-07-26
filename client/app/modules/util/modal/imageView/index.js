'use strict';

var app = angular.module('elyoosApp');

app.service('ImageViewService', require('./service'));
app.controller('ImageViewCtrl', require('./controller'));