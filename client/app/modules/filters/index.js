'use strict';

var app = require('angular').module('elyoosApp');


app.filter('fromTo', require('./fromToFilter'));