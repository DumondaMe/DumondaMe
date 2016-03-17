'use strict';

var app = angular.module('elyoosApp');
var directive = require('./directive.js');

app.directive(directive.name, directive.directive);

app.service('PageDetailReview', require('./services/pageDetailReview'));
app.service('PageRatingOverviewCalcService', require('./services/calculator'));