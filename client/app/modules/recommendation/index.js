'use strict';

var app = angular.module('elyoosApp');

app.controller('ModalAddRecommendationCtrl', require('./modalAddRecommendationCtrl'));

app.service('PageRecommendation', require('./services/pageRecommendation'));