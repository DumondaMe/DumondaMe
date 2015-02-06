'use strict';

var directive = require('../../../../app/modules/directives/imageCropper/directive');
elyoosAppModule.directive(directive.name, directive.directive);

describe('Tests of Directive ely-image-upload', function () {
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

        element = angular.element("<ely-image-upload image='test.imageToUpload' image-result-data='test.imageResultData' " +
            "get-data-to-upload='test.getDataToUpload'></ely-image-upload>");

        $compile(element)(scope);
        scope.$digest();
    }));


    it('Generate ely-image-upload and load image', function () {

        var image = element.find('img');
        expect(image.length).to.equal(1);

        rootScope.test.imageToUpload = 'data:image/jpeg;base64,/9j/4RCWRXhpZgAATU0AKgAAAAgADAEPAAIAAAAGAAAAngEQAAIA…vvNwDX0Z4NZVW328suM1y4n4GbYb40e02tk9xD5vlqyqwX/aq5/Z//AE7tXhyep9JD4In/2Q==';
        rootScope.$digest();

        image = element.find('img');
        expect(image.eq(0).attr('src')).to.equal(rootScope.test.imageToUpload);
    });

    it('Generate ely-image-upload and get data for upload', function () {

        var image = element.find('img'),
            mockImageResultData = sinon.mock(rootScope.test).expects('imageResultData');
        mockImageResultData.once();

        expect(image.length).to.equal(1);

        rootScope.test.getDataToUpload = '1';
        rootScope.$digest();

        mockImageResultData.verify();
    });
});
