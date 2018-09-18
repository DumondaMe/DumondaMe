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
        clean: ['testResult/*.*'],
        sonarRunner: {
            analysis: {
                options: {
                    separator: '\n',
                    sonar: {
                        projectKey: 'javascript-sonar-runner-dumonda-me-api',
                        projectName: 'DumondaMe Api',
                        projectVersion: '0.1',
                        sources: 'api/api, api/models, server.js',
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
                        exclusions: ''
                    }
                }
            }
        },
        mocha_istanbul: {
            coverage: {
                src: ['api/test/test/**/*.js'],
                options: {
                    coverage: true,
                    coverageFolder: 'coverage',
                    reportFormats: ['lcovonly'],
                    timeout: 20000,
                    nodeOptions: ['--preserve-symlinks']
                }
            }
        }
    });

    grunt.registerTask('test', ['env:dev', 'clean', 'mochaTest:test']);
    grunt.registerTask('coverage', ['env:dev', 'clean', 'mocha_istanbul:coverage']);
    grunt.registerTask('analysis', ['sonarRunner:analysis']);

    let outputFile = process.env.MOCHA_OUTPUT_FILE || 'xunit.xml';
    grunt.registerTask('cleanXunitFile', 'Remove Mocha output from xunit file', function() {
        if (grunt.file.exists('./' + outputFile)) {
            let file = grunt.file.read('./' + outputFile);
            if (file.indexOf("<testsuite")) {
                grunt.file.write('./' + outputFile, file.substring(file.indexOf("<testsuite")));
            }
        }
        else {
            grunt.log.error("'cleanXunitFile' task was specified but file " + outputFile + " does not exist.");
        }
    });
};
