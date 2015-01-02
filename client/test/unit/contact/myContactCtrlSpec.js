'use strict';

var myContactCtrl = require('../../../app/modules/contact/myContactCtrl')[3];
var underscore = require('../../../app/lib/underscore/underscore');

describe('Tests of My Contact Controller', function () {
    var scope, httpBackend, http;

    beforeEach(function (done) {
        inject(function ($rootScope, $injector, $http) {

            var response = {
                data: [{
                    id: '1',
                    desc: 'Freund',
                    name: 'Hans Muster'
                }, {
                    id: '2',
                    desc: 'Bekannter',
                    name: 'Hans2 Muster2'
                }],
                count_desc: [{
                    key: 'Freund',
                    doc_count: 1
                }, {
                    key: 'Bekannter',
                    doc_count: 1
                }]
            };

            http = $http;
            httpBackend = $injector.get('$httpBackend');
            scope = $rootScope.$new();

            httpBackend.when('GET', '/api/user/contact')
                .respond(response);
            done();
        });
    });

    it('Successful submit Data to the server', function () {
        myContactCtrl(scope, http, underscore);
        httpBackend.flush();

        expect(scope.contacts.desc.length).to.equal(2);
        expect(scope.contacts.desc[0]).to.equal('Freund');
        expect(scope.contacts.desc[1]).to.equal('Bekannter');
    });
});
