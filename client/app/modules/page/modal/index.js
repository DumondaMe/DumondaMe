'use strict';

var app = angular.module('elyoosApp');

app.service('UploadPageService', require('./services/uploadPage'));
app.service('CheckPageExists', require('./services/checkPageExists'));
app.service('RecommendationResponseFormatter', require('./services/recommendationResponseFormatter'));
