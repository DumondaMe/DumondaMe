'use strict';

var app = require('angular').module('elyoosApp');

app.service('UserData', require('./userData'));

app.controller('UserCtrl', require('./userCtrl'));