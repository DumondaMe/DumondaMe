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
                        sources: '../server',
                        sourceEncoding: 'UTF-8',
                        language: 'js',

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

                        exclusions: 'node_modules/**/*,test/**/*,coverage/**/*,,db/**/*,config/**/*,gruntfile.js'
                    }
                }
            }
        },
        mocha_istanbul: {
            coverage: {
                src: ['test/test/**/*.js'],
                options: {
                    coverage: true,
                    coverageFolder: 'coverage',
                    reportFormats: ['lcovonly']
                }
            }
        }
    });

    grunt.registerTask('coverage', ['env:dev', 'mocha_istanbul:coverage']);
    grunt.registerTask('analysis', ['sonarRunner:analysis']);
};
