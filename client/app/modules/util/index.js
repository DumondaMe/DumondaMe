'use strict';

var app = angular.module('elyoosApp');

app.service('moment', require('./moment'));
app.service('ElyModal', require('./modal'));
app.service('UrlCache', require('./urlCache'));