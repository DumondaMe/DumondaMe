'use strict';

var uploadFileCtrl = require('../../../../app/modules/util/file/fileCtrl')[3];

describe('Tests of the upload file controller', function () {
    var scope, fileUpload, FileReader;

    beforeEach(function (done) {
        inject(function ($rootScope) {

            fileUpload = {};
            fileUpload.uploadFileToUrl = function () {
            };

            FileReader = {};
            FileReader.readAsDataURL = function () {
            };

            scope = $rootScope.$new();
            done();
        });
    });

    it('When the imageForUpload has changed, load the image', function () {

        var mockFileReaderRead = sinon.mock(FileReader).expects('readAsDataURL');
        mockFileReaderRead.once();

        scope.imageForUpload = {};
        FileReader.result = 'test';

        uploadFileCtrl(scope, fileUpload, FileReader);
        scope.imageForUpload = 'change';
        scope.$digest();
        FileReader.onloadend();

        expect(scope.imageForUploadPreview).to.equal(FileReader.result);
        mockFileReaderRead.verify();
    });

    it('When the imageForUpload is undefined, do not load the image', function () {

        var mockFileReaderRead = sinon.mock(FileReader).expects('readAsDataURL');
        mockFileReaderRead.never();

        scope.imageForUpload = {};
        FileReader.result = 'test';

        uploadFileCtrl(scope, fileUpload, FileReader);
        scope.imageForUpload = null;
        scope.$digest();

        mockFileReaderRead.verify();
    });
});
