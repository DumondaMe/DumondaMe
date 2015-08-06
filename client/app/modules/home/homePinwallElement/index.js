'use strict';

var app = require('angular').module('elyoosApp');
var directive = require('./directive.js');

app.controller('HomePinwallElementNewMessageCtrl', require('./newMessageCtrl'));
app.controller('HomePinwallElementRecommendationCtrl', require('./recommendationCtrl'));
app.controller('HomePinwallElementContactingCtrl', require('./contactingCtrl'));
app.controller('HomePinwallElementBlogCtrl', require('./blogCtrl'));
app.controller('HomePinwallElementBlogDetailCtrl', require('./blogDetail/blogDetailCtrl'));

app.directive(directive.name, directive.directive);
