'use strict';

var app = angular.module('elyoosApp');

app.service('DateFormatCheckService', require('./dateFormatCheck'));
app.service('dateFormatter', require('./dateFormatter'));