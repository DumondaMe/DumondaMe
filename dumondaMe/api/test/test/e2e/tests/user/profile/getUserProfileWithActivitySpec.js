'use strict';

let users = require('dumonda-me-server-test-util').user;
let requestHandler = require('dumonda-me-server-test-util').requestHandler;
let dbDsl = require('dumonda-me-server-test-util').dbDSL;

describe('Getting user profile with activity feed', function () {

    beforeEach(async function () {
        await dbDsl.init(10);

        dbDsl.createRegion('region-1', {de: 'regionDe', en: 'regionEn'});
        dbDsl.createMainTopic({topicId: 'topic1', descriptionDe: 'topic1De', descriptionEn: 'topic1En'});
        dbDsl.createMainTopic({topicId: 'topic2', descriptionDe: 'topic2De', descriptionEn: 'topic2En'});

        dbDsl.createCommitment('20', {
            adminId: '1', topics: ['topic1', 'topic2'], language: 'de', created: 444, modified: 606,
            website: 'https://www.example.org/', regions: ['region-1'], title: 'Das ist ein Commitment'
        });

        dbDsl.createCommitment('21', {
            adminId: '2', topics: ['topic1'], language: 'de', created: 444, modified: 607,
            website: 'https://www.example2.org/', regions: ['region-1'], title: 'Das ist ein Commitment2'
        });

        dbDsl.createQuestion('100', {
            creatorId: '3', question: 'Das ist eine Frage', description: 'Test dumonda.me change the world',
            topics: ['topic2'], language: 'de', created: 666
        });

        dbDsl.createQuestion('101', {
            creatorId: '4', question: 'Das ist eine Frage2', description: 'Test dumonda.me change the world2',
            topics: ['topic2'], language: 'de', created: 666
        });

        dbDsl.createBookAnswer('1', {
            creatorId: '1', questionId: '100', created: 555, authors: 'Hans Wurst', googleBookId: '1234',
            hasPreviewImage: true
        });
        dbDsl.createCommitmentAnswer('2', {
            creatorId: '2', questionId: '100', commitmentId: '20', created: 554, description: 'commitmentDescription'
        });
        dbDsl.createLinkAnswer('3', {
            creatorId: '3', questionId: '100', created: 553, link: 'https://example.com', pageType: 'blog',
            hasPreviewImage: true
        });
        dbDsl.createTextAnswer('4', {
            creatorId: '3', questionId: '100', answer: 'Answer', created: 552
        });
        dbDsl.createYoutubeAnswer('5', {
            creatorId: '3', questionId: '100', created: 551, idOnYoutube: 'Lhku7ZBWEK8',
            link: 'https://www.youtube.com/watch?v=Lhku7ZBWEK8', linkEmbed: 'https://www.youtube.com/embed/Lhku7ZBWEK8'
        });

    });

    afterEach(function () {
        return requestHandler.logout();
    });

    it('Get profile of logged in user', async function () {
        dbDsl.upVoteAnswer({userId: '1', answerId: '3', created: 999});
        dbDsl.watchQuestion({questionId: '100', userId: '1', created: 998});
        dbDsl.watchCommitment({commitmentId: '21', userId: '1', created: 997});
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.get('/api/user/profile', {guiLanguage: 'de', languages: ['de']});
        res.status.should.equal(200);
        res.body.feed.length.should.equal(5);

        res.body.feed[0].type.should.equals('Link');
        res.body.feed[0].action.should.equals('upVote');
        res.body.feed[0].answerId.should.equals('3');
        res.body.feed[0].created.should.equals(999);

        res.body.feed[1].type.should.equals('Question');
        res.body.feed[1].action.should.equals('watch');
        res.body.feed[1].questionId.should.equals('100');
        res.body.feed[1].created.should.equals(998);

        res.body.feed[2].type.should.equals('Commitment');
        res.body.feed[2].action.should.equals('watch');
        res.body.feed[2].commitmentId.should.equals('21');
        res.body.feed[2].created.should.equals(997);

        res.body.feed[3].type.should.equals('Book');
        res.body.feed[3].action.should.equals('created');
        res.body.feed[3].answerId.should.equals('1');
        res.body.feed[3].created.should.equals(555);

        res.body.feed[4].type.should.equals('Commitment');
        res.body.feed[4].action.should.equals('created');
        res.body.feed[4].commitmentId.should.equals('20');
        res.body.feed[4].created.should.equals(444);
    });

    it('Get profile of another user', async function () {

        dbDsl.upVoteAnswer({userId: '2', answerId: '4', created: 999});
        dbDsl.watchQuestion({questionId: '101', userId: '2', created: 998});
        dbDsl.watchCommitment({commitmentId: '20', userId: '2', created: 997});

        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.get('/api/user/profile', {guiLanguage: 'de', languages: ['de'], userId: '2'});
        res.status.should.equal(200);
        res.body.feed.length.should.equal(5);

        res.body.feed[0].type.should.equals('Text');
        res.body.feed[0].action.should.equals('upVote');
        res.body.feed[0].answerId.should.equals('4');
        res.body.feed[0].created.should.equals(999);

        res.body.feed[1].type.should.equals('Question');
        res.body.feed[1].action.should.equals('watch');
        res.body.feed[1].questionId.should.equals('101');
        res.body.feed[1].created.should.equals(998);

        res.body.feed[2].type.should.equals('Commitment');
        res.body.feed[2].action.should.equals('watch');
        res.body.feed[2].commitmentId.should.equals('20');
        res.body.feed[2].created.should.equals(997);

        res.body.feed[3].type.should.equals('CommitmentAnswer');
        res.body.feed[3].action.should.equals('created');
        res.body.feed[3].answerId.should.equals('2');
        res.body.feed[3].created.should.equals(554);

        res.body.feed[4].type.should.equals('Commitment');
        res.body.feed[4].action.should.equals('created');
        res.body.feed[4].commitmentId.should.equals('21');
        res.body.feed[4].created.should.equals(444);
    });

    it('Get profile data of a user (Not logged in)', async function () {
        dbDsl.upVoteAnswer({userId: '1', answerId: '3', created: 999});
        dbDsl.watchQuestion({questionId: '100', userId: '1', created: 998});
        dbDsl.watchCommitment({commitmentId: '21', userId: '1', created: 997});
        await dbDsl.sendToDb();
        let res = await requestHandler.get('/api/user/profile', {userId: '1', guiLanguage: 'de', languages: ['de']});
        res.status.should.equal(200);
        res.body.feed.length.should.equal(5);
        res.body.feed[0].type.should.equals('Link');
        res.body.feed[0].action.should.equals('upVote');
        res.body.feed[0].answerId.should.equals('3');
        res.body.feed[0].created.should.equals(999);

        res.body.feed[1].type.should.equals('Question');
        res.body.feed[1].action.should.equals('watch');
        res.body.feed[1].questionId.should.equals('100');
        res.body.feed[1].created.should.equals(998);

        res.body.feed[2].type.should.equals('Commitment');
        res.body.feed[2].action.should.equals('watch');
        res.body.feed[2].commitmentId.should.equals('21');
        res.body.feed[2].created.should.equals(997);

        res.body.feed[3].type.should.equals('Book');
        res.body.feed[3].action.should.equals('created');
        res.body.feed[3].answerId.should.equals('1');
        res.body.feed[3].created.should.equals(555);

        res.body.feed[4].type.should.equals('Commitment');
        res.body.feed[4].action.should.equals('created');
        res.body.feed[4].commitmentId.should.equals('20');
        res.body.feed[4].created.should.equals(444);
    });
});
