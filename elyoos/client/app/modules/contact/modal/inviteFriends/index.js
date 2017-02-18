'use strict';

var app = angular.module('elyoosApp');

app.controller('InviteFriendsCtrl', require('./controller'));

app.service('InviteFriendsTokenParser', require('./services/tokenParser'));
app.factory('ImportGmailContacts', require('./services/importGmailContacts'));

