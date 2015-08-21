'use strict';

var uploadFileCtrl = require('../../../../app/modules/util/file/fileCtrl')[4];

describe('Tests of the upload file controller', function () {
    var scope, fileUpload, FileReader, FileReaderUtil;

    beforeEach(function (done) {
        inject(function ($rootScope) {

            fileUpload = {};
            fileUpload.uploadFileToUrl = function () {
            };

            FileReader = {};
            FileReader.readAsDataURL = function () {
            };

            FileReaderUtil = {};
            FileReader.dataURItoBlob = function () {
            };

            scope = $rootScope.$new();
            done();
        });
    });

    it('When the imageForUpload has changed, load the image', function () {

        var mockFileReaderRead = sinon.mock(FileReader).expects('readAsDataURL');
        mockFileReaderRead.once();

        scope.image = {};
        scope.image.imageForUpload = {};
        FileReader.result = 'test';

        uploadFileCtrl(scope, fileUpload, FileReader, FileReaderUtil);
        scope.image.imageForUpload = 'change';
        scope.$digest();
        FileReader.onloadend();

        expect(scope.image.imageForUploadPreview).to.equal(FileReader.result);
        mockFileReaderRead.verify();
    });

    it('When the imageForUpload is undefined, do not load the image', function () {

        var mockFileReaderRead = sinon.mock(FileReader).expects('readAsDataURL');
        mockFileReaderRead.never();

        scope.image = {};
        scope.image.imageForUpload = {};
        FileReader.result = 'test';

        uploadFileCtrl(scope, fileUpload, FileReader, FileReaderUtil);
        scope.image.imageForUpload = null;
        scope.$digest();

        mockFileReaderRead.verify();
    });
});
