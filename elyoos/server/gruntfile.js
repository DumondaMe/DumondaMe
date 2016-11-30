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

        mochaTest: {
            test: {
                options: {
                    reporter: 'xunit',
                    captureFile: 'testResult/xunit.xml', // Optionally capture the reporter output to a file
                    quiet: true, // Optionally suppress output to standard out (defaults to false)
                    clearRequireCache: false, // Optionally clear the require cache before running tests (defaults to false),
                    timeout: 20000
                },
                src: ['test/**/*.js']
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

                        exclusions: 'node_modules/**/*,test/**/*,coverage/**/*,,db/**/*,config/**/*,data/**/*,.sonar/**/*,gruntfile.js,testResult/**/*'
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

    grunt.registerTask('test', ['env:dev', 'mochaTest:test']);
    grunt.registerTask('coverage', ['env:dev', 'mocha_istanbul:coverage']);
    grunt.registerTask('analysis', ['sonarRunner:analysis']);

    var outputFile = process.env.MOCHA_OUTPUT_FILE || 'testResult/xunit.xml';
    grunt.registerTask('cleanXunitFile', 'Remove Mocha output from xunit file', function() {
        if (grunt.file.exists('./' + outputFile)) {
            var file = grunt.file.read('./' + outputFile);
            if (file.indexOf("<testsuite")) {
                grunt.file.write('./' + outputFile, file.substring(file.indexOf("<testsuite")));
            }
        }
        else {
            grunt.log.error("'cleanXunitFile' task was specified but file " + outputFile + " does not exist.");
        }
    });
};
