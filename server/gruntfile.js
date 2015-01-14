'use strict';

module.exports = function (grunt) {

    require("matchdep").filterDev("grunt-*").forEach(grunt.loadNpmTasks);

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        env: {
            dev: {
                NODE_ENV: 'testing',
                PORT: '8081'
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
                                reportPath: 'coverage/lcov.info'
                            }
                        },

                        exclusions: 'node_modules/**/*,test/**/*,coverage/**/*,.sonar/**/*,db/**/*,config/**/*,gruntfile.js',

                        projectKey: 'javascript-sonar-runner-elyoos-server',
                        projectName: 'Elyoos Server',
                        projectVersion: '0.1',
                        sources: '../server',
                        language: 'js',
                        sourceEncoding: 'UTF-8'
                    }
                }
            }
        },
        mocha_istanbul: {
            coverage: {
                coverage: true,
                src: ['test/test/**/*.js'],
                options: {
                    coverageFolder: 'coverage',
                    reportFormats: ['lcovonly']
                }
            }
        }
    });

    grunt.registerTask('coverage', ['env:dev', 'mocha_istanbul:coverage', 'sonarRunner:analysis']);
};
