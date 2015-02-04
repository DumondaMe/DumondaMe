'use strict';

var fileUpload = require('../../../../app/modules/util/file/fileUpload')[2];

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

        var stubHttp = sinon.stub(http, 'post'),
            spyCall;

        fileUpload(http, scope);

        scope.uploadFileToUrl({}, '/api/sendFile');

        spyCall = stubHttp.getCall(0);

        expect(spyCall.args[0]).to.equal('/api/sendFile');
    });
});
