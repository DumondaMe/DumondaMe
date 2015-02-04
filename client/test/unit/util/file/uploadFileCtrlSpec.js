'use strict';

var uploadFileCtrl = require('../../../../app/modules/util/file/uploadFileCtrl')[3];

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

    it('startUpload causes the updateImageResult to be increased', function () {

        scope.updateImageResult = 2;

        uploadFileCtrl(scope, fileUpload, FileReader);
        scope.startUpload();
        expect(scope.updateImageResult).to.equal(3);
    });

    it('startUpload at the first call', function () {

        uploadFileCtrl(scope, fileUpload, FileReader);
        scope.startUpload();
        expect(scope.updateImageResult).to.equal(1);
    });

    it('Upload a Profile Image', function () {

        var data = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQAB',
            stubUploadFile = sinon.stub(fileUpload, 'uploadFileToUrl'),
            spyCall;
        uploadFileCtrl(scope, fileUpload, FileReader);
        scope.imageResultData(data);

        spyCall = stubUploadFile.getCall(0);

        expect(spyCall.args[0].type).to.equal('image/jpeg');
        expect(spyCall.args[0].size).to.equal(18);
    });
});
