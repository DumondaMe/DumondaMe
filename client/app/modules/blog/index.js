'use strict';

var app = angular.module('elyoosApp');

app.service('BlogDetail', require('./services/blogDetail'));

app.config(['$stateProvider', function ($stateProvider) {

    $stateProvider
        .state('blog', {
            abstract: true,
            url: '/blog'

        })
        .state('blog.detail', {
            url: '/detail/{blogId}',
            views: {
                'content@': {
                    template: '<ely-blog-detail></ely-blog-detail>'
                }
            },
            data: {title: 'Blog'}
        });
}]);