'use strict';

var app = require('angular').module('elyoosApp');

app.controller('LoggedInHeaderCtrl', require('./loggedInHeaderCtrl'));

app.factory('UserInfo', require('./userInfo'));
