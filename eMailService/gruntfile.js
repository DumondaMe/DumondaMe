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
        clean: ['testResult/*.*']
    });

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
