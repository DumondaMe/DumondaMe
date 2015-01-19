'use strict';

var browserify = require('browserify');

module.exports = function (grunt) {

    require("matchdep").filterDev("grunt-*").forEach(grunt.loadNpmTasks);

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        browserify: {
            client: {
                src: ['app/modules/**/*.js'],
                dest: 'app/dist/app.js'
            }
        },
        clean: ['app/dist/*.js'],
        uglify: {
            dist: {
                files: {
                    'app/dist/app.min.js': ['app/dist/app.js']
                }
            }
        },
        cssmin: {
            combine: {
                files: {
                    'app/dist/app.css': ['app/css/app/**/*.css']
                }
            }
        },
        sass: {
            dist: {
                files: {
                    'app/dist/build.css': 'app/sass/app.scss'
                }
            }
        },
        ngtemplates: {
            elyoosApp: {
                options: {
                    module: 'elyoosApp'
                },
                src: 'app/modules/**/*.html',
                dest: 'app/dist/templates.js'
            }
        },
        karma: {
            unit: {
                configFile: 'test/config/karma.coverage.conf.js',
                singleRun: true
            }
        },
        sonarRunner: {
            analysis: {
                options: {
                    debug: true,
                    separator: '\n',
                    sonar: {
                        jdbc: {
                            url: 'jdbc:postgresql://localhost/sonarqube',
                            username: 'postgres',
                            password: 'kuklik'
                        },

                        javascript: {
                            lcov: {
                                reportPath: 'test_out/coverage/lcov.info'
                            }
                        },

                        exclusions: '**/*app.js,**/*index.js',

                        projectKey: 'javascript-sonar-runner-elyoos-client',
                        projectName: 'Elyoos Client',
                        projectVersion: '0.1',
                        sources: 'app/modules',
                        language: 'js',
                        sourceEncoding: 'UTF-8'
                    }
                }
            }
        }
    });

    grunt.registerTask('coverage', ['karma', 'sonarRunner']);
    grunt.registerTask('build', ['clean', 'ngtemplates', 'sass', 'browserify', 'uglify']);
    grunt.registerTask('buildDebug', ['ngtemplates', 'browserify']);
};
