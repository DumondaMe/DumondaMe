'use strict';

var directive = require('../../../../app/modules/contact/contactPreview/directive.js');
var controller = require('../../../../app/modules/contact/contactPreview/contactPreviewCtrl');
elyoosAppModule.directive(directive.name, directive.directive);


describe('Tests of Directive ely-contact-preview', function () {
    var compile, rootScope, element;

    beforeEach(function () {
        angular.mock.module('elyoosApp');
    });

    beforeEach(inject(function ($compile, $rootScope) {

        compile = $compile;
        rootScope = $rootScope;
        sinon.stub(controller, 'directiveCtrl');

        element = angular.element("<ely-contact-preview></ely-contact-preview>");

        compile(element)(rootScope);
        rootScope.$digest();
    }));


    it('Generate ely-contact-preview', function () {

        var container = element.find('.contact-preview-content');
        expect(container.length).to.equal(1);
    });
});
