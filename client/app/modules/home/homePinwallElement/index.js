'use strict';

var app = require('angular').module('elyoosApp');
var directive = require('./directive.js');

app.controller('HomePinwallElementNewMessageCtrl', require('./newMessageCtrl'));
app.controller('HomePinwallElementRecommendationCtrl', require('./recommendationCtrl'));

app.directive(directive.name, directive.directive);
