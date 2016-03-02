'use strict';

var app = angular.module('elyoosApp');

app.service('moment', require('./moment'));
app.service('Observables', require('./observables'));
app.service('ElyModal', require('./modal'));
app.service('SearchService', require('./searchService'));
app.service('UrlCache', require('./urlCache'));