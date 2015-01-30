'use strict';

var app = require('angular').module('elyoosApp');
var directive = require('./directive.js');

app.directive(directive.name, directive.directive);
