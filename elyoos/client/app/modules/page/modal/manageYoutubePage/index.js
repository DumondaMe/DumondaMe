'use strict';

var app = angular.module('elyoosApp');

app.controller('ManageYoutubePageCtrl', require('./controller'));

app.service('YoutubePageCreateMessageService', require('./services/createMessage'));
app.service('PageYoutubeLink', require('./services/youtubeLink'));
