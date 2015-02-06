'use strict';

var directive = require('../../../../app/modules/directives/paginationNextPrevious/directive');
var controller = require('../../../../app/modules/directives/paginationNextPrevious/controller');
elyoosAppModule.directive(directive.name, directive.directive);

describe('Tests of Directive ely-pagination-next-previous', function () {
    var compile, rootScope, element;

    beforeEach(function () {
        angular.mock.module('elyoosApp');
    });

    beforeEach(inject(function ($compile, $rootScope) {

        compile = $compile;
        rootScope = $rootScope;
        sinon.stub(controller, 'directiveCtrl');

        element = angular.element("<ely-pagination-next-previous></ely-pagination-next-previous>");

        compile(element)(rootScope);
        rootScope.$digest();
    }));


    it('Generate ely-pagination-next-previous', function () {

        var container = element.find('.paginationNextPrevious-wrapper');
        expect(container.length).to.equal(1);
    });
});
