'use strict';

var app = require('angular').module('elyoosApp');
var elyHomeNavDirective = require('./directive.js');

app.directive(elyHomeNavDirective.name, elyHomeNavDirective.directive);
