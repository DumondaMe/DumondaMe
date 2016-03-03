'use strict';

var app = angular.module('elyoosApp');

app.service('CheckChangePasswordService', require('./services/checkChangePassword'));

app.controller('SettingChangePasswordCtrl', require('./controller'));
