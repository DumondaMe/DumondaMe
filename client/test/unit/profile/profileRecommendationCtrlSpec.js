'use strict';

var ProfileRecommendationCtrl = require('../../../app/modules/profile/profileRecommendationCtrl')[2];

describe('Tests of Profile Recommendation Ctrl', function () {
    var testee, scope, q, SendRecommendation, timeout;

    beforeEach(function (done) {
        inject(function ($rootScope, $q, $timeout) {

            scope = $rootScope.$new();
            q = $q;
            timeout = $timeout;

            SendRecommendation = {
                sendRecommendationUpdate: function () {
                },
                sendRecommendationDelete: function () {
                }
            };
            scope.user = {recommendations: []};
            testee = new ProfileRecommendationCtrl(scope, SendRecommendation);
            done();
        });
    });

    it('Open mode to adding a new recommendation', function () {

        scope.addRecommendation();

        expect(scope.headerState).to.equal('newRecommendation');
    });

    it('Submit a book recommendation', function () {

        var spySendRecommendation = sinon.spy(SendRecommendation, 'sendRecommendationUpdate'),
            submitData = {};

        scope.recommendation.selectedCategory = {property: 'book'};
        submitData.author = 'Hans';
        submitData.title = 'Wurst';
        submitData.category = 'book';
        submitData.ratingPositive = true;
        submitData.comment = 'HAHA';

        scope.bookRecommendation.author = submitData.author;
        scope.bookRecommendation.title = submitData.title;
        scope.recommendation.ratingPositive = submitData.ratingPositive;
        scope.recommendation.comment = submitData.comment;


        scope.submitRecommendation();

        expect(spySendRecommendation.calledWith(scope, submitData, undefined, '/api/user/profile/recommendation/book')).to.be.true;
    });

    it('Submit a link recommendation', function () {

        var spySendRecommendation = sinon.spy(SendRecommendation, 'sendRecommendationUpdate'),
            submitData = {};

        scope.recommendation.selectedCategory = {property: 'video'};
        submitData.link = 'Hans';
        submitData.title = 'Wurst';
        submitData.ratingPositive = true;
        submitData.comment = 'HAHA';
        submitData.category = 'video';

        scope.linkRecommendation.link = submitData.link;
        scope.linkRecommendation.title = submitData.title;
        scope.recommendation.ratingPositive = submitData.ratingPositive;
        scope.recommendation.comment = submitData.comment;


        scope.submitRecommendation();

        expect(spySendRecommendation.calledWith(scope, submitData, undefined, '/api/user/profile/recommendation/link')).to.be.true;
    });

    it('Delete a book recommendation', function () {

        var spySendRecommendation = sinon.spy(SendRecommendation, 'sendRecommendationDelete'),
            recommendation = {};

        recommendation.id = "ID";
        recommendation.category = 'book';

        scope.deleteRecommendation(recommendation);

        expect(spySendRecommendation.calledWith(scope, {id: 'ID'}, '/api/user/profile/recommendation/book')).to.be.true;
    });

    it('Delete a link recommendation', function () {

        var spySendRecommendation = sinon.spy(SendRecommendation, 'sendRecommendationDelete'),
            recommendation = {};

        recommendation.id = "ID";
        recommendation.category = 'video';

        scope.deleteRecommendation(recommendation);

        expect(spySendRecommendation.calledWith(scope, {id: 'ID'}, '/api/user/profile/recommendation/link')).to.be.true;
    });

    it('Open mode to modify a book recommendation', function () {

        var recommendation = {};

        recommendation.category = 'book';
        recommendation.author = 'Hans';
        recommendation.title = 'Wurst';
        recommendation.ratingPositive = true;
        recommendation.comment = 'HAHA';
        recommendation.id = 'ID';

        scope.updateRecommendation(recommendation);

        expect(scope.bookRecommendation.author).to.equal(recommendation.author);
        expect(scope.bookRecommendation.title).to.equal(recommendation.title);
        expect(scope.recommendation.ratingPositive).to.equal(recommendation.ratingPositive);
        expect(scope.recommendation.comment).to.equal(recommendation.comment);
        expect(scope.recommendation.id).to.equal(recommendation.id);
    });

    it('Open mode to modify a link recommendation', function () {

        var recommendation = {};

        recommendation.category = 'video';
        recommendation.link = 'www.juhu.ch';
        recommendation.title = 'Wurst';
        recommendation.ratingPositive = true;
        recommendation.comment = 'HAHA';
        recommendation.id = 'ID';

        scope.updateRecommendation(recommendation);

        expect(scope.linkRecommendation.link).to.equal(recommendation.link);
        expect(scope.linkRecommendation.title).to.equal(recommendation.title);
        expect(scope.recommendation.ratingPositive).to.equal(recommendation.ratingPositive);
        expect(scope.recommendation.comment).to.equal(recommendation.comment);
        expect(scope.recommendation.id).to.equal(recommendation.id);
    });

    it('Abort modify or add new recommendation', function () {

        scope.abort();

        expect(scope.headerState).to.equal('showRecommendation');
    });
});
