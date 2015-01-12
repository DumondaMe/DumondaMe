/*
'use strict';

var SendRecommendation = require('../../../app/modules/profile/sendRecommendation')[2];
var underscore = require('../../../app/lib/underscore/underscore');

describe('Tests of Sending Recommendation Service', function () {
    var testee, scope, q, HttpService, timeout;

    beforeEach(function (done) {
        inject(function ($rootScope, $q, $timeout) {

            scope = $rootScope.$new();
            q = $q;
            timeout = $timeout;

            HttpService = {
                sendPostRequest: function () {
                },
                sendDeleteRequest: function () {
                }
            };
            scope.user = {recommendations: []};
            testee = new SendRecommendation(HttpService, underscore);
            done();
        });
    });

    it('Submit successful a new recommendation', function () {

        var submitData = {
            author: 'Hans',
            link: 'www.hanswurst.ch',
            title: 'hanswurst',
            ratingPositive: true,
            comment: 'HaHa'
        }, stubHttpService = sinon.stub(HttpService, 'sendPostRequest');
        stubHttpService.returns(q.when({id: 'newID'}));

        testee.sendRecommendationUpdate(scope, submitData, undefined, 'www.igendwohin.ch');

        timeout.flush();

        expect(scope.user.recommendations.length).to.equal(1);
        expect(scope.user.recommendations[0].author).to.equal(submitData.author);
        expect(scope.user.recommendations[0].link).to.equal(submitData.link);
        expect(scope.user.recommendations[0].title).to.equal(submitData.title);
        expect(scope.user.recommendations[0].ratingPositive).to.equal(submitData.ratingPositive);
        expect(scope.user.recommendations[0].comment).to.equal(submitData.comment);

        expect(scope.submitFailedToServer).to.be.false;
        expect(scope.successUserDataChange).to.be.true;
    });

    it('Submit a new recommendation failed', function () {

        var submitData = {
            author: 'Hans',
            link: 'www.hanswurst.ch',
            title: 'hanswurst',
            ratingPositive: true,
            comment: 'HaHa'
        }, stubHttpService = sinon.stub(HttpService, 'sendPostRequest');
        stubHttpService.returns(q.reject());

        testee.sendRecommendationUpdate(scope, submitData, undefined, 'www.igendwohin.ch');

        timeout.flush();

        expect(scope.user.recommendations.length).to.equal(0);

        expect(scope.submitFailedToServer).to.be.true;
        expect(scope.successUserDataChange).to.be.false;
    });

    it('Submit successful a modified recommendation', function () {

        var submitData = {
            author: 'Hans',
            link: 'www.hanswurst.ch',
            title: 'hanswurst',
            ratingPositive: true,
            comment: 'HaHa'
        }, stubHttpService = sinon.stub(HttpService, 'sendPostRequest');
        stubHttpService.returns(q.when({id: 'newID'}));
        scope.user.recommendations.push(submitData);

        submitData.author = 'Hans2';
        submitData.link = 'www.hanswurst2.ch';
        submitData.title = 'hanswurst2';
        submitData.ratingPositive = false;
        submitData.comment = 'HaHa2';

        testee.sendRecommendationUpdate(scope, submitData, 'newID', 'www.igendwohin.ch');

        timeout.flush();

        expect(scope.user.recommendations.length).to.equal(1);
        expect(scope.user.recommendations[0].author).to.equal(submitData.author);
        expect(scope.user.recommendations[0].link).to.equal(submitData.link);
        expect(scope.user.recommendations[0].title).to.equal(submitData.title);
        expect(scope.user.recommendations[0].ratingPositive).to.equal(submitData.ratingPositive);
        expect(scope.user.recommendations[0].comment).to.equal(submitData.comment);

        expect(scope.submitFailedToServer).to.be.false;
        expect(scope.successUserDataChange).to.be.true;
    });

    it('Submit successful a delete request for a recommendation', function () {

        var recommendations = {}, recommendations2 = {},
            stubHttpService = sinon.stub(HttpService, 'sendDeleteRequest');
        stubHttpService.returns(q.when({id: 'newID'}));

        recommendations.id = 'newID';
        recommendations.author = 'Hans';
        recommendations.link = 'www.hanswurst.ch';
        recommendations.title = 'hanswurst';
        recommendations.ratingPositive = true;
        recommendations.comment = 'HaHa';
        scope.user.recommendations.push(recommendations);

        recommendations2.id = 'newID2';
        recommendations2.author = 'Hans2';
        recommendations2.link = 'www.hanswurst2.ch';
        recommendations2.title = 'hanswurst2';
        recommendations2.ratingPositive = false;
        recommendations2.comment = 'HaHa2';
        scope.user.recommendations.push(recommendations2);

        testee.sendRecommendationDelete(scope, {id: 'newID'}, 'www.igendwohin.ch');

        timeout.flush();

        expect(scope.user.recommendations.length).to.equal(1);
        expect(scope.user.recommendations[0].author).to.equal(recommendations2.author);
        expect(scope.user.recommendations[0].link).to.equal(recommendations2.link);
        expect(scope.user.recommendations[0].title).to.equal(recommendations2.title);
        expect(scope.user.recommendations[0].ratingPositive).to.equal(recommendations2.ratingPositive);
        expect(scope.user.recommendations[0].comment).to.equal(recommendations2.comment);
    });

    it('Submit a delete request for a recommendation failed', function () {

        var recommendations = {}, recommendations2 = {},
            stubHttpService = sinon.stub(HttpService, 'sendDeleteRequest');
        stubHttpService.returns(q.reject());

        recommendations.id = 'newID';
        recommendations.author = 'Hans';
        recommendations.link = 'www.hanswurst.ch';
        recommendations.title = 'hanswurst';
        recommendations.ratingPositive = true;
        recommendations.comment = 'HaHa';
        scope.user.recommendations.push(recommendations);

        recommendations2.id = 'newID2';
        recommendations2.author = 'Hans2';
        recommendations2.link = 'www.hanswurst2.ch';
        recommendations2.title = 'hanswurst2';
        recommendations2.ratingPositive = false;
        recommendations2.comment = 'HaHa2';
        scope.user.recommendations.push(recommendations2);

        testee.sendRecommendationDelete(scope, {id: 'newID'}, 'www.igendwohin.ch');

        timeout.flush();

        expect(scope.user.recommendations.length).to.equal(2);
        expect(scope.submitFailedToServer).to.be.true;
        expect(scope.successUserDataChange).to.be.false;
    });
});
 */
