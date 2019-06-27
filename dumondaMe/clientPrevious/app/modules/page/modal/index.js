'use strict';

var app = angular.module('elyoosApp');

app.service('UploadPageService', require('./services/uploadPage'));
app.service('CheckPageExists', require('./services/checkPageExists'));
app.service('RecommendationResponseFormatter', require('./services/recommendationResponseFormatter'));
app.service('Keywords', require('./services/keywords'));
app.service('KeywordSuggestion', require('./services/keywordsSuggestion'));
app.service('PageEvents', require('./services/pageEvents'));
app.service('PageAddress', require('./services/pageAddress'));
