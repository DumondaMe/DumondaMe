'use strict';

var app = angular.module('elyoosApp');
var directive = require('./directive.js');

app.directive(directive.name, directive.directive);

app.service('PageDetailRatings', require('./services/pageDetailRatings'));
app.service('PageRatingOverviewCalcService', require('./services/calculator'));