'use strict';

var app = require('angular').module('elyoosApp');

app.controller('LoggedInHeaderCtrl', require('./loggedInHeaderCtrl'));
app.controller('LeftNavColCtrl', require('./leftNavColCtrl'));

app.factory('UserInfo', require('./services/userInfo'));
app.factory('Modification', require('./services/modification'));
