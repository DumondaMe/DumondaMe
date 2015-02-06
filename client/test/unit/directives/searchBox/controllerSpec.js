'use strict';

var controller = require('../../../../app/modules/directives/searchBox/controller').directiveCtrl()[1];

describe('Tests of controller of the search-box directive', function () {
    var scope;

    beforeEach(function (done) {
        inject(function ($rootScope) {

            scope = $rootScope.$new();
            scope.getUser = function () {
            };
            done();
        });
    });

    it('Get the user when enter was pressed', function () {

        var stubGetUser = sinon.stub(scope, 'getUser');
        scope.query = 'Hans Muster';

        controller(scope);
        scope.sendGetUser({keyCode: 13});

        expect(stubGetUser.getCall(0).args[0]).to.equal(scope.query);
    });

    it('Get not the user when other key than enter was pressed', function () {

        var mockGetUser = sinon.mock(scope).expects('getUser');
        scope.query = 'Hans Muster';
        mockGetUser.never();

        controller(scope);
        scope.sendGetUser({keyCode: 14});

        mockGetUser.verify();
    });

    it('Get the user when typeahead selected a user', function () {

        var stubGetUser = sinon.stub(scope, 'getUser');

        controller(scope);
        scope.$broadcast('$typeahead.select', 'Hans');

        expect(stubGetUser.getCall(0).args[0]).to.equal('Hans');
    });

});
