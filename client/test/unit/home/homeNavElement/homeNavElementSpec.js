'use strict';

var directive = require('../../../../app/modules/home/homeNavElement/directive.js');
elyoosAppModule.directive(directive.name, directive.directive);


describe('Tests of Directive ely-home-nav-element', function () {
    var compile, rootScope, element;

    beforeEach(angular.mock.module('elyoosApp'));

    beforeEach(inject(function ($compile, $rootScope) {
        compile = $compile;
        rootScope = $rootScope.$new();

        element = angular.element('<ely-home-nav-element description="Beschreibung" image-url="test/url.ch" nav-to="profile.default"></ely-home-nav-element>');

        compile(element)(rootScope);
        rootScope.$digest();
    }));


    it('Add Description', function () {
        var descriptionElement = element.find('.navigation-element-description');
        expect(descriptionElement.length).to.equal(1);
        expect(descriptionElement.eq(0).text()).equals('Beschreibung');
    });

    it('Add Image Url', function () {
        var urlElement = element.find('img');
        expect(urlElement.length).to.equal(1);
        expect(urlElement.eq(0).attr('ng-src')).equals('test/url.ch');
    });

    it('Add the navigation to path', function () {
        var urlElement = element.find('a');
        expect(urlElement.length).to.equal(1);
        expect(urlElement.eq(0).attr('ui-sref')).equals('profile.default');
    });
});
