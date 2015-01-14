'use strict';

var myContactCtrl = require('../../../app/modules/contact/myContactCtrl')[3];
var underscore = require('../../../app/lib/underscore/underscore');

describe('Tests of My Contact Controller', function () {
    var scope, httpBackend, http;

    beforeEach(function (done) {
        inject(function ($rootScope, $injector, $http) {

            var response = {
                contacts: [{
                    id: '1',
                    type: 'Freund',
                    name: 'Hans Muster'
                }, {
                    id: '2',
                    type: 'Bekannter',
                    name: 'Hans2 Muster2'
                }],
                statistics: [{
                    type: 'Bekannter',
                    count: 1
                }, {
                    type: 'Freund',
                    count: 1
                }],
                numberOfContacts: 2
            };

            http = $http;
            httpBackend = $injector.get('$httpBackend');
            scope = $rootScope.$new();

            httpBackend.when('GET', '/api/user/contact?itemsPerPage=10&skip=0')
                .respond(response);
            done();
        });
    });

    it('Successful submit Data to the server', function () {
        myContactCtrl(scope, http, underscore);
        scope.getContacts(1);
        httpBackend.flush();

        expect(scope.users.contacts.length).to.equal(2);
        expect(scope.users.contacts[0].type).to.equal('Freund');
        expect(scope.users.contacts[1].type).to.equal('Bekannter');
    });
});
