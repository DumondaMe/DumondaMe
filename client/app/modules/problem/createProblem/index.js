'use strict';

var app = angular.module('elyoosApp');

app.controller('CreateProblemController', require('./controller'));

app.service('UploadProblem', require('./services/uploadProblem'));

app.service('CreateProblemCheck', require('./services/createProblemCheck'));
