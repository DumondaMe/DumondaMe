'use strict';

var app = angular.module('elyoosApp');

app.factory('UserInfoRequest', require('./services/userInfoRequest'));
app.factory('Modification', require('./services/modification'));

app.service('userInfo', require('./userInfo'));
app.service('UserDetailNavigation', require('./userDetailNavigation'));
