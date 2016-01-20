'use strict';

var app = angular.module('elyoosApp');
var directive = require('./directive.js');

app.directive(directive.name, directive.directive);

app.service('ScrollProblemReasonService', require('./services/scrollProblemReasonService'));
app.service('SortProblemReasonService', require('./services/sortProblemReasonService'));
app.service('ProblemReason', require('./services/problemReason'));