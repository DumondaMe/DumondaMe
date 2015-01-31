'use strict';

var express = require('express'),
    methodOverride = require('method-override'),
    cdn = require('./cdn');

module.exports = function (app) {

    app.on('middleware:before:urlEncoded', function () {
        app.use(methodOverride('X-HTTP-Method-Override'));
    });

    return {
        onconfig: function (config, next) {

            var cdnConfig = config.get('cdnStore');
            cdn.config(cdnConfig);
            next(null, config);
        }
    };

};
