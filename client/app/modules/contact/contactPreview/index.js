'use strict';

var app = angular.module('elyoosApp');
var elyContactPreviewDirective = require('./directive.js');

app.directive(elyContactPreviewDirective.name, elyContactPreviewDirective.directive);
