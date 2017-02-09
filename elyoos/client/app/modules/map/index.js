'use strict';

var app = angular.module('elyoosApp');
var directive = require('./directive.js');

app.directive(directive.name, directive.directive);

app.service('ElyMapMarkerService', require('./services/marker'));
app.service('PopularAddressRecommendation', require('./services/popularAddressRecommendation'));

app.config(['$stateProvider', function ($stateProvider) {

    $stateProvider
        .state('map', {
            abstract: true,
            url: '/map',
            data: {title: 'Karte'}
        })
        .state('map.overview', {
            url: '/overview',
            views: {
                'content@': {
                    template: '<ely-map-view></ely-map-view>'
                }
            }
        });
}]);
