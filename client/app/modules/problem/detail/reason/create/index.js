'use strict';

var app = angular.module('elyoosApp');

app.controller('CreateReasonController', require('./controller'));

app.service('UploadReason', require('./services/uploadReason'));
app.service('CreateProblemReasonCheck', require('./services/createProblemReasonCheck'));
