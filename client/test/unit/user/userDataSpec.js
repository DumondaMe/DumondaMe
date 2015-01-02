'use strict';

var UserDataService = require('../../../app/modules/user/userData')[2];

describe('Test of UserData Service', function () {
    var httpBackend, testee;

    beforeEach(function (done) {

        inject(function ($httpBackend, $http, $q) {
            httpBackend = $httpBackend;
            httpBackend.when('GET', 'api/user/profile').
                respond($q.when({userName: 'Steelman'}));
            testee = new UserDataService($http, $q);
            done();
        });
    });

    it('should return the User Data', function () {
        var result;
        testee.getUserData().then(function (data) {
            result = data;
        });
        httpBackend.flush();
        expect(result.userName).to.equal('Steelman');
    });
});
