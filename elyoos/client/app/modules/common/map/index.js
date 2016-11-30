'use strict';

var app = angular.module('elyoosApp');
var directive = require('./directive.js');

app.directive(directive.name, directive.directive);

app.service('MapCenter', require('./services/center'));
app.service('MapDistanceCalculator', require('./services/distanceCalculator'));
app.service('MapChangeHandler', require('./services/mapChangeHandler'));
app.service('MapMarker', require('./services/markers'));
