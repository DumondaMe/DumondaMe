'use strict';

var sinon = require('sinon');
var limiteRate = require('../../../../../lib/limiteRate');

var getRate = sinon.stub(limiteRate, 'getRate');

getRate.returns(function (req, res, next) {
    next();
});


module.exports = {
    getRate: getRate
};