'use strict';

var app = angular.module('elyoosApp');

app.controller('DiscussionManageCtrl', require('./controller'));

app.service('CreateDiscussion', require('./services/createDiscussion'));
app.service('EditDiscussion', require('./services/editDiscussion'));
app.service('CreateDiscussionMessage', require('./services/discussionMessage'));