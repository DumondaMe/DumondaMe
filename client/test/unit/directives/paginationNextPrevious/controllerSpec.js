'use strict';

var controller = require('../../../../app/modules/common/paginationNextPrevious/controller').directiveCtrl()[1];

describe('Tests of controller of the ely-pagination-next-previous directive', function () {
    var scope, rootScope;

    beforeEach(function (done) {
        inject(function ($rootScope) {

            rootScope = $rootScope;
            scope = $rootScope.$new();
            scope.getPaginationSet = function () {
            };
            done();
        });
    });

    it('Set total number of items and reset pagination', function () {

        scope.itemsPerPage = '5';
        scope.totalItems = '20';

        controller(scope);
        scope.currentPagination = 3;
        scope.$digest();

        expect(scope.currentPagination).to.equal(1);
        expect(scope.currentPaginationRange).to.equal(4);
    });

    it('Reset pagination from outside with resetCounter', function () {

        scope.itemsPerPage = '20';

        controller(scope);
        scope.currentPagination = 3;
        rootScope.$broadcast('pagination.next.previous.reset');

        expect(scope.currentPagination).to.equal(1);
    });

    it('Go to previous pagination', function () {

        scope.itemsPerPage = '5';
        scope.totalItems = '10';

        controller(scope);
        scope.$digest();
        scope.currentPagination = 2;
        scope.clickPrevious();

        expect(scope.currentPagination).to.equal(1);
        expect(scope.currentPaginationRange).to.equal(2);
    });

    it('Go to previous pagination is not allowed because current index is already on first element', function () {

        scope.itemsPerPage = '5';
        scope.totalItems = '10';

        controller(scope);
        scope.$digest();
        scope.currentPagination = 1;
        scope.clickPrevious();

        expect(scope.currentPagination).to.equal(1);
        expect(scope.currentPaginationRange).to.equal(2);
    });

    it('Go to next pagination', function () {

        scope.itemsPerPage = '5';
        scope.totalItems = '10';

        controller(scope);
        scope.$digest();
        scope.currentPagination = 1;
        scope.clickNext();

        expect(scope.currentPagination).to.equal(2);
        expect(scope.currentPaginationRange).to.equal(2);
    });

    it('Go to next pagination is not allowed because current index is already on last element', function () {

        scope.itemsPerPage = '5';
        scope.totalItems = '10';

        controller(scope);
        scope.$digest();
        scope.currentPagination = 2;
        scope.clickNext();

        expect(scope.currentPagination).to.equal(2);
        expect(scope.currentPaginationRange).to.equal(2);
    });

});
