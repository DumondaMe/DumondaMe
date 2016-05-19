'use strict';

var app = angular.module('elyoosApp');

app.controller('ManageLinkPageCtrl', require('./controller'));

app.service('LinkPageCreateMessageService', require('./services/createMessage'));
app.service('PageLinkUrlCheck', require('./services/url'));
