'use strict';

var app = require('angular').module('elyoosApp');
var elyContactPreviewDirective = require('./directive.js');

app.controller('ContactPreviewCtrl', require('./contactPreviewCtrl'));

app.directive(elyContactPreviewDirective.name, elyContactPreviewDirective.directive);
