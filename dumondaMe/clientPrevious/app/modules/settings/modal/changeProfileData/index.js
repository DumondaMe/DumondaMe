'use strict';

var app = angular.module('elyoosApp');

app.service('ProfileDataMessageService', require('./services/profileDataMessage'));

app.controller('SettingChangeProfileDataCtrl', require('./controller'));
