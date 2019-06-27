'use strict';

var app = angular.module('elyoosApp');

app.controller('InviteFriendsCtrl', require('./controller'));

app.service('SourceImportModification', require('./services/sourceImportModification'));
app.service('InviteFriendsSelectedEMails', require('./services/selectedEmails'));
app.service('InviteFriendsUserMessage', require('./services/userMessage'));
app.service('OAuthOpenWindow', require('./services/oAuthOpenWindow'));
app.factory('SendInviteEmail', require('./services/sendInviteEmail'));

