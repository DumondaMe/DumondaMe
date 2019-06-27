'use strict';

var placeCategory = [{description: 'Organisation', code: 'organisation'},
    {description: 'Shop', code: 'shop'},
    {description: 'Praxis', code: '	practice'}];

module.exports = ['$log',
    function ($log) {
        this.placeCategory = placeCategory;

    }];
