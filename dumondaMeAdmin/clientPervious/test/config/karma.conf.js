'use strict';

module.exports = function (config) {
    config.set({
        basePath: '../../',

        files: [
            'app/lib/jquery/jquery.min.js',
            'app/lib/angular/angular.js',
            'app/lib/angular/angular-mocks.js',
            'app/modules/**/*.js',
            'app/modules/**/*.html',
            '../../elyoos/client/app/modules/util/**/*.js',
            '../../elyoos/client/app/modules/util/**/*.html',
            'test/unit/init.js',
            'test/unit/**/*.js'
        ],

        exclude: [
            'app/modules/**/*index.js',
            'app/modules/**/*directive.js',
            '../../elyoos/client/app/modules/**/*index.js',
            '../../elyoos/client/app/modules/**/*directive.js',
            'app/modules/app.js'
        ],

        singleRun: true,

        frameworks: ['mocha', 'browserify', 'chai', 'sinon'],

        browsers: ['PhantomJS'],

        plugins: [
            'karma-junit-reporter',
            'karma-phantomjs-launcher',
            'karma-browserify',
            'karma-mocha',
            'karma-sinon',
            'karma-chai',
            'karma-ng-html2js-preprocessor'
        ],

        logLevel: 'LOG_DEBUG',

        reporters: ['junit'],

        preprocessors: {
            'app/modules/**/*.html': ['ng-html2js'],
            'test/unit/**/*.js': ['browserify'],
            // do not include tests or libraries
            // (these files will be instrumented by Istanbul)
            'app/modules/**/*.js': ['browserify'],
            '../../elyoos/client/app/modules/util/**/*.js': ['browserify'],
            'app/lib/moment/*.js': ['browserify']
        },

        ngHtml2JsPreprocessor: {
            moduleName: 'elyoosApp'
        },

        junitReporter: {
            outputFile: '../test_out/junit/TESTS-xunit.xml'
        },

        browserify: {
            debug: true
        }

    });
};
