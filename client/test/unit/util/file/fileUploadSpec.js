'use strict';

var fileUpload = require('../../../../app/modules/util/file/fileUpload')[1];

describe('Test of Uploading a file to the server', function () {
    var http, scope;


    beforeEach(function (done) {
        angular.mock.module('ngCookies');

        inject(function ($http, $rootScope) {
            http = $http;
            scope = $rootScope.$new();
            done();
        });
    });

    it('Send Data', function () {

        var stubHttp = sinon.stub(http, 'post');

        new fileUpload(http).uploadFileToUrl({}, '/api/sendFile');

        expect(stubHttp.getCall(0).args[0]).to.equal('/api/sendFile');
    });
});
