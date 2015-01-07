'use strict';

var contactPreviewCtrl = require('../../../app/modules/contact/contactPreviewCtrl')[3];
var underscore = require('../../../app/lib/underscore/underscore');

describe('Tests of Contact Preview Controller', function () {
    var scope, httpBackend, http;

    beforeEach(function (done) {
        inject(function ($rootScope, $injector, $http) {

            http = $http;
            httpBackend = $injector.get('$httpBackend');
            scope = $rootScope.$new();

            httpBackend.when('POST', '/api/user/contact')
                .respond({});
            done();
        });
    });

    it('Change type', function () {

        var contacts = {
            types: ['Freund', 'Bekannter', 'Kollege'],
            desc_count: [{key: 'Freund', doc_count: '10'}]
        };
        scope.users = {};
        scope.users.contacts = contacts;
        scope.contact = {id: 1, name: 'Hans Muster', type: 'Kollege'};

        scope.$hide = function () {
        };
        contactPreviewCtrl(scope, http);

        scope.contact.typeNew = 'Freund';

        scope.sendNewDescription();

        httpBackend.flush();

        expect(scope.contact.type).to.equal('Freund');

        /*expect(scope.contacts.desc.length).to.equal(2);
         expect(scope.contacts.desc[0]).to.equal('Freund');
         expect(scope.contacts.desc[1]).to.equal('Bekannter');*/
    });
});
