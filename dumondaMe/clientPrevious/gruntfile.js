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
        browserify: {
            dist: {
                files: {
                    'app/dist/app.js': ['app/modules/**/*.js']
                }
            }
        },
        clean: ['app/dist/*.js'],
        uglify: {
            dist: {
                files: {
                    'app/dist/app.js': ['app/dist/app.js']
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
                src: 'app/modules/**/*.html',
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
            localDev: {
                constants: {
                    OAUTH_GMAIL_URL: 'https://accounts.google.com/o/oauth2/auth?response_type=code&client_id=270929621236-4cauqnck95vm8ohkvu3rokhp74jued28.apps.googleusercontent.com&scope=https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fcontacts.readonly&redirect_uri=http%3A%2F%2Flocalhost:8080%2Fauth',
                    OAUTH_YAHOO_URL: 'https://api.login.yahoo.com/oauth2/request_auth?response_type=code&client_id=dj0yJmk9YmxtcnBNTVdkUTUwJmQ9WVdrOVFtRnFNMkpUTm1zbWNHbzlNQS0tJnM9Y29uc3VtZXJzZWNyZXQmeD0wMw--&scope=&redirect_uri=https%3A%2F%2Fpreview.elyoos.org%2Fauth',
                    OAUTH_OUTLOOK_URL: 'https://login.microsoftonline.com/common/oauth2/v2.0/authorize?response_type=code&client_id=fd3fdc4c-3601-42ec-a23b-2ba31eb4dc8b&scope=openid%20https://outlook.office.com/contacts.read&redirect_uri=http%3A%2F%2Flocalhost:8080%2Fauth',
                    RECAPTCHA_SITE_KEY: '6LfWvyYTAAAAADB8n5MjlwL2V23ZRKCJY3wUbixJ'
                }
            },
            preview: {
                constants: {
                    OAUTH_GMAIL_URL: 'https://accounts.google.com/o/oauth2/auth?response_type=code&client_id=270929621236-4cauqnck95vm8ohkvu3rokhp74jued28.apps.googleusercontent.com&scope=https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fcontacts.readonly&redirect_uri=https%3A%2F%2Fpreview.elyoos.org%2Fauth',
                    OAUTH_YAHOO_URL: 'https://api.login.yahoo.com/oauth2/request_auth?response_type=code&client_id=dj0yJmk9eUZUbXlHYVNVcDBrJmQ9WVdrOVIycFNkVXd5Tm5VbWNHbzlNQS0tJnM9Y29uc3VtZXJzZWNyZXQmeD0xNA--&scope=&redirect_uri=https%3A%2F%2Fpreview.elyoos.org%2Fauth',
                    OAUTH_OUTLOOK_URL: 'https://login.microsoftonline.com/common/oauth2/v2.0/authorize?response_type=code&client_id=dd12544c-d6e4-4d3d-92b8-7b42941284e9&scope=openid%20https://outlook.office.com/contacts.read&redirect_uri=https%3A%2F%2Fpreview.elyoos.org%2Fauth',
                    RECAPTCHA_SITE_KEY: '6LfaWCYUAAAAAFi_PqbbYG9sz7zPWg-QCisdwmaS'
                }
            },
            production: {
                constants: {
                    OAUTH_GMAIL_URL: 'https://accounts.google.com/o/oauth2/auth?response_type=code&client_id=270929621236-4cauqnck95vm8ohkvu3rokhp74jued28.apps.googleusercontent.com&scope=https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fcontacts.readonly&redirect_uri=https%3A%2F%2Fwww.elyoos.org%2Fauth',
                    OAUTH_YAHOO_URL: 'https://api.login.yahoo.com/oauth2/request_auth?response_type=code&client_id=dj0yJmk9bmowWmdhb2hpclBIJmQ9WVdrOVVFeGxRM1I1TkhVbWNHbzlNQS0tJnM9Y29uc3VtZXJzZWNyZXQmeD1lMg--&scope=&redirect_uri=https%3A%2F%www.elyoos.org%2Fauth',
                    OAUTH_OUTLOOK_URL: 'https://login.microsoftonline.com/common/oauth2/v2.0/authorize?response_type=code&client_id=4604a845-acf0-4770-9a2c-6b0e19943b94&scope=openid%20https://outlook.office.com/contacts.read&redirect_uri=https%3A%2F%2Fwww.elyoos.org%2Fauth',
                    RECAPTCHA_SITE_KEY: '6LfaWCYUAAAAAFi_PqbbYG9sz7zPWg-QCisdwmaS'
                }
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

    grunt.registerTask('test', ['karma']);
    grunt.registerTask('coverage', ['karma', 'sonarRunner']);
    grunt.registerTask('build', ['clean', 'ngtemplates', 'ngconstant', 'browserify', 'uglify']);
    grunt.registerTask('buildDebug', ['ngtemplates', 'ngconstant:localDev', 'browserify']);
    grunt.registerTask('buildPreview', ['clean', 'ngtemplates', 'ngconstant:preview', 'browserify', 'uglify']);
    grunt.registerTask('buildProduction', ['clean', 'ngtemplates', 'ngconstant:production', 'browserify', 'uglify']);
};
