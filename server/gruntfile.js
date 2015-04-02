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
                    separator: '\n',
                    sonar: {
                        projectKey: 'javascript-sonar-runner-elyoos-server',
                        projectName: 'Elyoos Server',
                        projectVersion: '0.1',
                        projectBaseDir: '../',
                        sources: 'server,common/src',
                        sourceEncoding: 'UTF-8',
                        language: 'js',

                        jdbc: {
                            url: 'jdbc:postgresql://localhost/sonarqube',
                            username: 'postgres',
                            password: 'kuklik'
                        },

                        javascript: {
                            lcov: {
                                reportPath: 'server/coverage/lcov.info'
                            }
                        },

                        exclusions: 'cdn/**/*,server/node_modules/**/*,server/test/**/*,server/coverage/**/*,coverage/**/*,server/db/**/*,server/config/**/*,server/gruntfile.js'
                    }
                }
            }
        },
        mocha_istanbul: {
            coverage: {
                src: ['test/test/**/*.js'],
                options: {
                    coverage: true,
                    root: './../',
                    coverageFolder: 'coverage',
                    reportFormats: ['lcovonly']
                }
            }
        }
    });

    grunt.registerTask('coverage', ['env:dev', 'mocha_istanbul:coverage']);
    grunt.registerTask('analysis', ['sonarRunner:analysis']);
};
