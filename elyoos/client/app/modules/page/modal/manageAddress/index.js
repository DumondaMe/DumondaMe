'use strict';

var app = angular.module('elyoosApp');

app.controller('ManageAddressCtrl', require('./controller'));

app.service('AddressCreateMessageService', require('./services/createMessage'));

