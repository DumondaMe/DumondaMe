'use strict';

let users = require('elyoos-server-test-util').user;
let requestHandler = require('elyoos-server-test-util').requestHandler;
let dbDsl = require('elyoos-server-test-util').dbDSL;

describe('Getting user profile with commitments', function () {

    beforeEach(async function () {
        await dbDsl.init(4);

        dbDsl.createQuestion('100', {
            creatorId: '1', question: 'Das ist eine Frage', description: 'Test elyoos.org change the world', topics: ['Spiritual'],
            language: 'de', created: 666
        });

        dbDsl.createQuestion('101', {
            creatorId: '2', question: 'Das ist eine Frage2', description: 'Test elyoos.org change the world', topics: ['Spiritual'],
            language: 'de', created: 888
        });

        dbDsl.createRegion('region-1', {});

        dbDsl.createCommitment('10', {
            adminId: '1', topics: ['Spiritual', 'Meditation'], language: 'de', created: 888,
            website: 'https://www.example.org/', regions: ['region-1'], title: 'Das ist ein Commitment'
        });
        dbDsl.watchCommitment({commitmentId: '10', userId: '2', created: 999});
        dbDsl.watchCommitment({commitmentId: '10', userId: '3', created: 888});
        dbDsl.showQuestionOnCommitment({commitmentId: '10', questionId: '100', created: 840});

        dbDsl.createCommitment('11', {
            adminId: '1', topics: ['Spiritual', 'Meditation'], language: 'de', created: 777,
            website: 'https://www.example.org/', regions: ['region-1'], title: 'Das ist ein Commitment2'
        });
        dbDsl.createCommitment('12', {
            adminId: '2', topics: ['Spiritual', 'Meditation'], language: 'de', created: 666,
            website: 'https://www.example.org/', regions: ['region-1'], title: 'Das ist ein Commitment3'
        });
        dbDsl.watchCommitment({commitmentId: '12', userId: '1', created: 555});

        dbDsl.createCommitment('13', {
            adminId: '2', topics: ['Spiritual', 'Meditation'], language: 'de', created: 999,
            website: 'https://www.example.org/', regions: ['region-1'], title: 'Das ist ein Commitment4'
        });
        dbDsl.watchCommitment({commitmentId: '13', userId: '1', created: 444});
        dbDsl.showQuestionOnCommitment({commitmentId: '13', questionId: '100', created: 840});
        dbDsl.showQuestionOnCommitment({commitmentId: '13', questionId: '101', created: 840});
    });

    afterEach(function () {
        return requestHandler.logout();
    });

    it('Get profile of logged in user', async function () {

        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.get('/api/user/profile');
        res.status.should.equal(200);

        res.body.numberOfCommitments.should.equal(2);
        res.body.numberOfWatchingCommitments.should.equal(2);

        res.body.commitments.length.should.equal(2);
        res.body.commitments[0].commitmentId.should.equal('10');
        res.body.commitments[0].title.should.equal('Das ist ein Commitment');
        res.body.commitments[0].description.should.equal(`commitment10Description`);
        res.body.commitments[0].commitmentSlug.should.equal('das-ist-ein-commitment');
        res.body.commitments[0].created.should.equal(888);
        res.body.commitments[0].numberOfWatches.should.equal(2);
        res.body.commitments[0].numberOfLinkedQuestions.should.equal(1);

        res.body.commitments[1].commitmentId.should.equal('11');
        res.body.commitments[1].title.should.equal('Das ist ein Commitment2');
        res.body.commitments[1].description.should.equal(`commitment11Description`);
        res.body.commitments[1].commitmentSlug.should.equal('das-ist-ein-commitment2');
        res.body.commitments[1].created.should.equal(777);
        res.body.commitments[1].numberOfWatches.should.equal(0);
        res.body.commitments[1].numberOfLinkedQuestions.should.equal(0);

        res.body.watchingCommitments.length.should.equal(2);
        res.body.watchingCommitments[0].commitmentId.should.equal('12');
        res.body.watchingCommitments[0].title.should.equal('Das ist ein Commitment3');
        res.body.watchingCommitments[0].description.should.equal(`commitment12Description`);
        res.body.watchingCommitments[0].commitmentSlug.should.equal('das-ist-ein-commitment3');
        res.body.watchingCommitments[0].created.should.equal(555);
        res.body.watchingCommitments[0].numberOfWatches.should.equal(1);
        res.body.watchingCommitments[0].numberOfLinkedQuestions.should.equal(0);

        res.body.watchingCommitments[1].commitmentId.should.equal('13');
        res.body.watchingCommitments[1].title.should.equal('Das ist ein Commitment4');
        res.body.watchingCommitments[1].description.should.equal(`commitment13Description`);
        res.body.watchingCommitments[1].commitmentSlug.should.equal('das-ist-ein-commitment4');
        res.body.watchingCommitments[1].created.should.equal(444);
        res.body.watchingCommitments[1].numberOfWatches.should.equal(1);
        res.body.watchingCommitments[1].numberOfLinkedQuestions.should.equal(2);
    });

    it('Get profile of another user', async function () {

        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser2);
        let res = await requestHandler.get('/api/user/profile', {userId: '1'});
        res.status.should.equal(200);

        res.body.numberOfCommitments.should.equal(2);
        res.body.numberOfWatchingCommitments.should.equal(2);

        res.body.commitments.length.should.equal(2);
        res.body.commitments[0].commitmentId.should.equal('10');
        res.body.commitments[0].title.should.equal('Das ist ein Commitment');
        res.body.commitments[0].description.should.equal(`commitment10Description`);
        res.body.commitments[0].commitmentSlug.should.equal('das-ist-ein-commitment');
        res.body.commitments[0].created.should.equal(888);
        res.body.commitments[0].numberOfWatches.should.equal(2);
        res.body.commitments[0].numberOfLinkedQuestions.should.equal(1);

        res.body.commitments[1].commitmentId.should.equal('11');
        res.body.commitments[1].title.should.equal('Das ist ein Commitment2');
        res.body.commitments[1].description.should.equal(`commitment11Description`);
        res.body.commitments[1].commitmentSlug.should.equal('das-ist-ein-commitment2');
        res.body.commitments[1].created.should.equal(777);
        res.body.commitments[1].numberOfWatches.should.equal(0);
        res.body.commitments[1].numberOfLinkedQuestions.should.equal(0);

        res.body.watchingCommitments.length.should.equal(2);
        res.body.watchingCommitments[0].commitmentId.should.equal('12');
        res.body.watchingCommitments[0].title.should.equal('Das ist ein Commitment3');
        res.body.watchingCommitments[0].description.should.equal(`commitment12Description`);
        res.body.watchingCommitments[0].commitmentSlug.should.equal('das-ist-ein-commitment3');
        res.body.watchingCommitments[0].created.should.equal(555);
        res.body.watchingCommitments[0].numberOfWatches.should.equal(1);
        res.body.watchingCommitments[0].numberOfLinkedQuestions.should.equal(0);

        res.body.watchingCommitments[1].commitmentId.should.equal('13');
        res.body.watchingCommitments[1].title.should.equal('Das ist ein Commitment4');
        res.body.watchingCommitments[1].description.should.equal(`commitment13Description`);
        res.body.watchingCommitments[1].commitmentSlug.should.equal('das-ist-ein-commitment4');
        res.body.watchingCommitments[1].created.should.equal(444);
        res.body.watchingCommitments[1].numberOfWatches.should.equal(1);
        res.body.watchingCommitments[1].numberOfLinkedQuestions.should.equal(2);
    });

    it('Get profile data of a user (Not logged in)', async function () {

        await dbDsl.sendToDb();
        let res = await requestHandler.get('/api/user/profile', {userId: '1'});
        res.status.should.equal(200);

        res.body.numberOfCommitments.should.equal(2);
        res.body.numberOfWatchingCommitments.should.equal(2);

        res.body.commitments.length.should.equal(2);
        res.body.commitments[0].commitmentId.should.equal('10');
        res.body.commitments[0].title.should.equal('Das ist ein Commitment');
        res.body.commitments[0].description.should.equal(`commitment10Description`);
        res.body.commitments[0].commitmentSlug.should.equal('das-ist-ein-commitment');
        res.body.commitments[0].created.should.equal(888);
        res.body.commitments[0].numberOfWatches.should.equal(2);
        res.body.commitments[0].numberOfLinkedQuestions.should.equal(1);

        res.body.commitments[1].commitmentId.should.equal('11');
        res.body.commitments[1].title.should.equal('Das ist ein Commitment2');
        res.body.commitments[1].description.should.equal(`commitment11Description`);
        res.body.commitments[1].commitmentSlug.should.equal('das-ist-ein-commitment2');
        res.body.commitments[1].created.should.equal(777);
        res.body.commitments[1].numberOfWatches.should.equal(0);
        res.body.commitments[1].numberOfLinkedQuestions.should.equal(0);

        res.body.watchingCommitments.length.should.equal(2);
        res.body.watchingCommitments[0].commitmentId.should.equal('12');
        res.body.watchingCommitments[0].title.should.equal('Das ist ein Commitment3');
        res.body.watchingCommitments[0].description.should.equal(`commitment12Description`);
        res.body.watchingCommitments[0].commitmentSlug.should.equal('das-ist-ein-commitment3');
        res.body.watchingCommitments[0].created.should.equal(555);
        res.body.watchingCommitments[0].numberOfWatches.should.equal(1);
        res.body.watchingCommitments[0].numberOfLinkedQuestions.should.equal(0);

        res.body.watchingCommitments[1].commitmentId.should.equal('13');
        res.body.watchingCommitments[1].title.should.equal('Das ist ein Commitment4');
        res.body.watchingCommitments[1].description.should.equal(`commitment13Description`);
        res.body.watchingCommitments[1].commitmentSlug.should.equal('das-ist-ein-commitment4');
        res.body.watchingCommitments[1].created.should.equal(444);
        res.body.watchingCommitments[1].numberOfWatches.should.equal(1);
        res.body.watchingCommitments[1].numberOfLinkedQuestions.should.equal(2);
    });
});
