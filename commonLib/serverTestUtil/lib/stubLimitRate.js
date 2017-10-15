'use strict';

let sinon = require('sinon');
let limiteRate;

let getRate;

module.exports = function () {
    return {
        init: function (newLimiteRate) {
            limiteRate = newLimiteRate;
            getRate = sinon.stub(limiteRate, 'getRate');
            getRate.returns(function (req, res, next) {
                next();
            });
        },
        getRate: getRate
    };
};