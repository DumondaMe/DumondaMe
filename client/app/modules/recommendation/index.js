'use strict';

var app = require('angular').module('elyoosApp');

app.controller('ModalAddRecommendationCtrl', require('./modalAddRecommendationCtrl'));

app.service('PageRecommendation', require('./services/pageRecommendation'));