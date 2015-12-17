'use strict';

var app = angular.module('elyoosApp');

app.controller('ProfilePreviewPopoverCtrl', require('./profilePreview/profilePreviewPopoverCtrl'));

app.factory('UserInfo', require('./services/userInfo'));
app.factory('Modification', require('./services/modification'));
