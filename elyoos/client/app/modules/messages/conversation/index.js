'use strict';

var app = angular.module('elyoosApp');
var directive = require('./directive.js');

app.directive(directive.name, directive.directive);

app.service('MessagesScrollRequestResponseHandler', require('./services/scrollRequestResponseHandler'));
app.service('MessageNextDayService', require('./services/messageNextDay'));
app.service('ConversationModificationUpdate', require('./services/modificationUpdate'));