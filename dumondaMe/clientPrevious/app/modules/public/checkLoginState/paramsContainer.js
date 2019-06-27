'use strict';


module.exports = [
    function () {
        var params;
        var next;

        this.setParams = function (newNext, newParams) {
            params = newParams;
            next = newNext;
        };

        this.getParams = function () {
            return params;
        };

        this.getNext = function () {
            return next;
        };
    }];
