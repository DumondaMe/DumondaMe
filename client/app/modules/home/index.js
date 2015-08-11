'use strict';

var app = require('angular').module('elyoosApp');

app.factory('Home', require('./services/home'));
app.factory('Blog', require('./services/blog'));

app.service('HomeLeftNavElements', require('./services/leftNavElements'));
app.service('HomePinwallRequest', require('./pinwall/pinwallRequest'));
app.service('HomePinwallElements', require('./pinwall/pinwallElements'));
app.service('HomePinwall', require('./pinwall/pinwall'));
app.service('HomePinwallHeightCalculator', require('./pinwall/heightCalculator'));

app.controller('HomeCtrl', require('./homeCtrl'));
