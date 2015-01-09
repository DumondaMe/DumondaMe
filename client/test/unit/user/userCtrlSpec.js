/*
'use strict';

var UserCtrl = require('../../../app/modules/user/userCtrl')[3];

describe('Tests of User Controller', function () {
    var testee, stubUserData, timeout, scope, rootScope, q;

    beforeEach(function (done) {
        var userDataMock = {
            getUserData: function () {
            }
        };

        inject(function ($rootScope, $q, $timeout) {

            scope = $rootScope.$new();
            rootScope = $rootScope;
            timeout = $timeout;
            q = $q;
            stubUserData = sinon.stub(userDataMock, 'getUserData');
            stubUserData.returns(q.when({forename: 'Steelman'}));

            testee = new UserCtrl(scope, rootScope, userDataMock);
            done();
        });
    });


    it('should get User Data', function () {
        expect(stubUserData.calledOnce).to.be.true;
        timeout.flush();
        expect(rootScope.user.forename).to.equal('Steelman');
    });

    it('should get User Data second time when update is called', function () {
        expect(stubUserData.calledOnce).to.be.true;
        timeout.flush();
        expect(rootScope.user.forename).to.equal('Steelman');

        stubUserData.returns(q.when({forename: 'SteelmanUpdate'}));
        scope.updateUser();
        timeout.flush();
        expect(rootScope.user.forename).to.equal('SteelmanUpdate');
    });
});
 */
