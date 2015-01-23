'use strict';

var app = require('angular').module('elyoosApp');
var elyContactPreviewDirective = require('./directive.js');

app.directive(elyContactPreviewDirective.name, elyContactPreviewDirective.directive);
