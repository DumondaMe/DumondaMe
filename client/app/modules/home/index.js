'use strict';

var app = require('angular').module('elyoosApp');

app.factory('Home', require('./services/home'));
app.factory('Blog', require('./services/blog'));

app.service('HomeLeftNavElements', require('./services/leftNavElements'));
app.service('HomePinwallContainer', require('./services/pinwallContainer'));

app.controller('HomeCtrl', require('./homeCtrl'));
