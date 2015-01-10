'use strict';

var directive = require('../../../../app/modules/directives/searchBox/directive.js');
elyoosAppModule.directive(directive.name, directive.directive);

describe('Tests of Directive ely-search-bar', function () {
    var compile, rootScope, element;

    beforeEach(function () {
        angular.mock.module('elyoosApp');
    });

    beforeEach(inject(function ($compile, $rootScope) {

        compile = $compile;
        rootScope = $rootScope;

        element = angular.element("<ely-search-box></ely-search-box>");

        compile(element)(rootScope);
        rootScope.$digest();
    }));


    it('Generate ely-search-box', function () {

        var textInput = element.find('input');
        expect(textInput.eq(0).hasClass('form-control')).to.be.true;
    });
});
