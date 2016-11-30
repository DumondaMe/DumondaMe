exports.config = {
    allScriptsTimeout: 11000,
    seleniumServerJar: '../../node_modules/selenium/lib/runner/selenium-server-standalone-2.20.0.jar',
    chromeDriver: '../../node_modules/chromedriver/bin/chromedriver',

    specs: [
        '../e2e/*Spec.js'
    ],

    capabilities: {
        'browserName': 'chrome'
    },

    baseUrl: 'http://localhost:8082/',

    framework: 'jasmine',

    jasmineNodeOpts: {
        defaultTimeoutInterval: 30000
    }
};
