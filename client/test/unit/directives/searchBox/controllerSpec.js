'use strict';

var controller = require('../../../../app/modules/common/searchBox/controller').directiveCtrl()[1];

describe('Tests of controller of the search-box directive', function () {
    var scope;

    beforeEach(function (done) {
        inject(function ($rootScope) {

            scope = $rootScope.$new();
            scope.getQuery = function () {
            };
            done();
        });
    });

    it('Send the query request when enter was pressed', function () {

        var stubGetQuery = sinon.stub(scope, 'getQuery');
        scope.query = 'Hans Muster';

        controller(scope);
        scope.sendGetQuery({keyCode: 13});

        expect(stubGetQuery.getCall(0).args[0]).to.equal(scope.query);
    });

    it('Send not the query request when other key than enter was pressed', function () {

        var mockGetQuery = sinon.mock(scope).expects('getQuery');
        scope.query = 'Hans Muster';
        mockGetQuery.never();

        controller(scope);
        scope.sendGetQuery({keyCode: 14});

        mockGetQuery.verify();
    });

    it('Send the query request when typeahead selected a element', function () {

        var stubGetQuery = sinon.stub(scope, 'getQuery');

        controller(scope);
        scope.$broadcast('$typeahead.select', 'Hans');

        expect(stubGetQuery.getCall(0).args[0]).to.equal('Hans');
    });

});
