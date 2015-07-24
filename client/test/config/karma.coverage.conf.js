'use strict';

module.exports = function (config) {
    config.set({
        basePath: '../../',

        files: [
            'app/lib/jquery/jquery.min.js',
            'app/lib/imageCrop/cropper.min.js',
            'app/lib/spin/spin.min.js',
            'app/lib/angular/angular.js',
            'app/lib/angular/angular-cookies.js',
            'app/lib/angular/angular-mocks.js',
            'app/lib/angular/angular-resource.js',
            'app/modules/**/*.js',
            'app/modules/**/*.html',
            'test/unit/init.js',
            'test/unit/**/*.js'
        ],

        exclude: [
            'app/modules/**/*index.js',
            'app/modules/app.js'
        ],

        singleRun: true,

        frameworks: ['mocha', 'browserify', 'chai', 'sinon'],

        browsers: ['Chrome'],

        plugins: [
            'karma-junit-reporter',
            'karma-coverage',
            'karma-chrome-launcher',
            'karma-browserify',
            'karma-mocha',
            'karma-sinon',
            'karma-chai',
            'karma-ng-html2js-preprocessor'
        ],

        logLevel: 'LOG_DEBUG',

        reporters: ['junit', 'coverage'],

        preprocessors: {
            'app/modules/**/*.html': ['ng-html2js'],
            'test/unit/**/*.js': ['browserify'],
            // source files, that you wanna generate coverage for
            // do not include tests or libraries
            // (these files will be instrumented by Istanbul)
            'app/modules/**/*.js': ['browserify', 'coverage'],
            'app/lib/moment/*.js': ['browserify']
        },

        ngHtml2JsPreprocessor: {
            moduleName: 'elyoosApp'
        },

        coverageReporter: {
            type: 'lcovonly',
            dir: 'test_out/coverage/',
            subdir: '.'
        },

        junitReporter: {
            outputFile: 'test_out/junit/TESTS-xunit.xml'
        },

        browserify: {
            debug: true,
            transform: ['browserify-istanbul']
        }

    });
};
