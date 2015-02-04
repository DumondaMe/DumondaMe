'use strict';

var directive = require('../../../../app/modules/util/file/fileModel.js');
elyoosAppModule.directive(directive.name, directive.directive);

describe('Tests of attribute directive ely-file-model', function () {
    var compile, rootScope, element;

    beforeEach(function () {
        angular.mock.module('elyoosApp');
    });

    beforeEach(inject(function ($compile, $rootScope) {

        compile = $compile;
        rootScope = $rootScope;
        rootScope.inputFile = 'test';

        element = angular.element("<input type='file' ely-file-model='inputFile'>");

        compile(element)(rootScope);
        rootScope.$digest();
    }));


    it('Change the ely-file-model value', function () {

    });
});
