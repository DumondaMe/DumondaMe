'use strict';

var app = angular.module('elyoosApp');

app.service('ModifyGroupNameService', require('./services/groupSetting'));

app.controller('ModifyGroupSettingController', require('./controller'));
