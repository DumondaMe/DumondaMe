'use strict';

var app = angular.module('elyoosApp');
var directive = require('./directive.js');

app.directive(directive.name, directive.directive);

app.config(['$stateProvider', function ($stateProvider) {

    $stateProvider
        .state('info', {
            url: '/info/',
            views: {
                content: {
                    template: '<ely-info></ely-info>'
                }
            },
            data: {hasBackNav: true, hasSearch: false, title: 'Infos'}
        });
}]);
