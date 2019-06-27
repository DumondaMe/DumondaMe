'use strict';

var app = angular.module('elyoosApp');

app.service('ConversationMessageService', require('./services/conversationMessage'));
app.service('CreateMessageCheck', require('./services/createMessageCheck'));

app.controller('CreateMessageCtrl', require('./controller'));