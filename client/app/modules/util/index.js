'use strict';

var app = require('angular').module('elyoosApp');

app.service('HttpService', require('./httpService'));
app.service('_', require('./underscore'));
