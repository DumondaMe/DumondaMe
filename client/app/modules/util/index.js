'use strict';

var app = require('angular').module('elyoosApp');

app.service('moment', require('./moment'));
app.service('PromiseModal', require('./promiseModal'));