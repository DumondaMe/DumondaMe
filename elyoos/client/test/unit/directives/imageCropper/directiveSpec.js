/*
'use strict';

var directive = require('../../../../app/modules/directives/imageCropper/directive');
elyoosAppModule.directive(directive.name, directive.directive);

describe('Tests of Directive ely-image-cropper', function () {
    var scope, element, rootScope;

    beforeEach(function () {
        angular.mock.module('elyoosApp');
    });

    beforeEach(inject(function ($compile, $rootScope) {

        rootScope = $rootScope;
        scope = $rootScope.$new();

        rootScope.test = {};
        rootScope.test.imageToUpload = null;
        rootScope.test.getDataToUpload = null;
        rootScope.test.imageResultData = function () {
        };

        element = angular.element("<ely-image-cropper image='test.imageToUpload' image-result-data='test.imageResultData' " +
            "get-data-to-upload='test.getDataToUpload'></ely-image-cropper>");

        $compile(element)(scope);
        scope.$digest();
    }));


    it('Generate ely-image-cropper and load image', function () {

        var image = element.find('img');
        expect(image.length).to.equal(1);
    });
});
*/
