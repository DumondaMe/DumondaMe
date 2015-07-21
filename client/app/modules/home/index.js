'use strict';

var app = require('angular').module('elyoosApp');

app.controller('HomeCtrl', require('./homeCtrl'));

app.factory('Home', require('./services/home'));

app.service('HomeLeftNavElements', require('./services/leftNavElements'));

require('./homeNavElement');
