'use strict';

var processNgConstant = function (ngConstant) {
    return {version: ngConstant.version};
};

module.exports = function (grunt) {

    require("matchdep").filterDev("grunt-*").forEach(grunt.loadNpmTasks);

    grunt.file.defaultEncoding = 'utf8';
    grunt.file.preserveBOM = true;

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        copy: {
            main: {
                files: [{
                    src: ['../../elyoos/client/app/sass/common.css'],
                    dest: 'app/dist/common.css',
                    expand: false
                }, {
                    src: ['../../elyoos/client/app/sass/common.css.map'],
                    dest: 'app/dist/common.css.map',
                    expand: false
                }]
            }
        },
        browserify: {
            dist: {
                files: {
                    'app/dist/app.js': ['app/modules/**/*.js', '../../elyoos/client/app/modules/util/**/*.js',
                        '../../elyoos/client/app/modules/common/**/*.js']
                }
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
                    module: 'elyoosApp',
                    url: function (url) {
                        return url.replace('../../elyoos/client/', '');
                    },
                    htmlmin: {
                        collapseBooleanAttributes: true,
                        collapseWhitespace: true,
                        removeAttributeQuotes: true,
                        removeComments: true, // Only if you don't use comment directives!
                        removeEmptyAttributes: true,
                        removeRedundantAttributes: true,
                        removeScriptTypeAttributes: true,
                        removeStyleLinkTypeAttributes: true
                    }
                },
                src: ['app/modules/**/*.html', '../../elyoos/client/app/modules/common/**/*.html'],
                dest: 'app/dist/templates.js'
            }
        },
        karma: {
            unit: {
                configFile: 'test/config/karma.conf.js'
            }
        },
        ngconstant: {
            options: {
                name: 'config',
                dest: 'app/dist/config.js',
                constants: {
                    elyoosVersion: processNgConstant(grunt.file.readJSON('../server/package.json'))
                }
            },
            build: {}
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

                        projectKey: 'javascript-sonar-runner-elyoos-client-admin',
                        projectName: 'Elyoos Admin Client',
                        projectVersion: '0.1',
                        sources: 'app/modules',
                        language: 'js',
                        sourceEncoding: 'UTF-8'
                    }
                }
            }
        }
    });

    grunt.registerTask('test', ['karma']);
    grunt.registerTask('coverage', ['karma', 'sonarRunner']);
    grunt.registerTask('build', ['clean', 'ngtemplates', 'ngconstant', 'browserify', 'copy', 'uglify']);
    grunt.registerTask('buildDebug', ['ngtemplates', 'ngconstant', 'browserify', 'copy']);
};
