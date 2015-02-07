'use strict';

var directive = require('../../../../app/modules/directives/spin/directive');
elyoosAppModule.directive(directive.name, directive.directive);

describe('Tests of Directive ely-spin', function () {
    var scope, element, rootScope;

    beforeEach(function () {
        angular.mock.module('elyoosApp');
    });

    beforeEach(inject(function ($compile, $rootScope) {

        rootScope = $rootScope;
        scope = $rootScope.$new();

        element = angular.element("<ely-spin></ely-spin>");

        $compile(element)(scope);
        scope.$digest();
    }));


    it('Generate ely-spin', function () {
        var textInput = element.find('.spinner');
        expect(textInput.length).to.equals(1);
    });

});
