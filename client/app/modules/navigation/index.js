'use strict';

var app = angular.module('elyoosApp');

app.controller('LoggedInHeaderCtrl', require('./loggedInHeaderCtrl'));
app.controller('LeftNavColCtrl', require('./leftNavColCtrl'));
app.controller('ProfilePreviewPopoverCtrl', require('./profilePreview/profilePreviewPopoverCtrl'));

app.factory('UserInfo', require('./services/userInfo'));
app.factory('Modification', require('./services/modification'));
