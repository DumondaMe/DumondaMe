'use strict';

let users = require('elyoos-server-test-util').user;
let dbDsl = require('elyoos-server-test-util').dbDSL;
let requestHandler = require('elyoos-server-test-util').requestHandler;

describe('Get commitments watched by the requested user', function () {

    beforeEach(async function () {
        await dbDsl.init(9);

        dbDsl.createQuestion('100', {
            creatorId: '1', question: 'Das ist eine Frage', description: 'Test elyoos.org change the world',
            topics: ['Spiritual'], language: 'de', created: 666
        });

        dbDsl.createRegion('region-1', {de: 'regionDe', en: 'regionEn'});

        dbDsl.createCommitment('10', {
            adminId: '3', topics: ['Spiritual'], language: 'de', created: 888, modified: 1110,
            website: 'https://www.example.org/', regions: ['region-1']
        });

        dbDsl.createCommitment('11', {
            adminId: '3', topics: ['Spiritual'], language: 'de', created: 887, modified: 1111,
            website: 'https://www.example2.org/', regions: ['region-1'], title: 'Das ist ein Commitment'
        });
        dbDsl.watchCommitment({commitmentId: '11', userId: '4', created: 999});
        dbDsl.watchCommitment({commitmentId: '11', userId: '5', created: 888});
        dbDsl.showQuestionOnCommitment({commitmentId: '11', questionId: '100', created: 840});

        dbDsl.createCommitment('12', {
            adminId: '3', topics: ['Spiritual'], language: 'de', created: 886,
            website: 'https://www.example3.org/', regions: ['region-1'], title: 'Das ist ein Commitment2'
        });

        dbDsl.createCommitment('13', {
            adminId: '3', topics: ['Spiritual'], language: 'de', created: 885, modified: 1114,
            website: 'https://www.example4.org/', regions: ['region-1']
        });

        dbDsl.watchCommitment({commitmentId: '10', userId: '1', created: 999});
        dbDsl.watchCommitment({commitmentId: '11', userId: '1', created: 998});
        dbDsl.watchCommitment({commitmentId: '12', userId: '1', created: 997});
        dbDsl.watchCommitment({commitmentId: '13', userId: '1', created: 996});
    });

    afterEach(function () {
        return requestHandler.logout();
    });

    it('Get commitments the logged in user is watching', async function () {

        dbDsl.setUserPrivacy('1', {privacyMode: 'onlyContact'});
        await dbDsl.sendToDb();

        await requestHandler.login(users.validUser);
        let res = await requestHandler.get('/api/user/profile/commitment', {
            userId: '1', maxItems: 2, skip: 1, isWatching: true
        });
        res.status.should.equal(200);
        res.body.numberOfCommitments.should.equal(4);

        res.body.commitments.length.should.equal(2);
        res.body.commitments[0].commitmentId.should.equal('11');
        res.body.commitments[0].title.should.equal('Das ist ein Commitment');
        res.body.commitments[0].description.should.equal(`commitment11Description`);
        res.body.commitments[0].commitmentSlug.should.equal('das-ist-ein-commitment');
        res.body.commitments[0].imageUrl.should.equal(`${process.env.PUBLIC_IMAGE_BASE_URL}/commitment/11/120x120/title.jpg?v=1111`);
        res.body.commitments[0].created.should.equal(998);
        res.body.commitments[0].numberOfWatches.should.equal(3);
        res.body.commitments[0].numberOfLinkedQuestions.should.equal(1);

        res.body.commitments[1].commitmentId.should.equal('12');
        res.body.commitments[1].title.should.equal('Das ist ein Commitment2');
        res.body.commitments[1].description.should.equal(`commitment12Description`);
        res.body.commitments[1].commitmentSlug.should.equal('das-ist-ein-commitment2');
        res.body.commitments[1].imageUrl.should.equal(`${process.env.PUBLIC_IMAGE_BASE_URL}/commitment/12/120x120/title.jpg`);
        res.body.commitments[1].created.should.equal(997);
        res.body.commitments[1].numberOfWatches.should.equal(1);
        res.body.commitments[1].numberOfLinkedQuestions.should.equal(0);
    });

    it('Get commitments a user is watching (public, visible)', async function () {

        await dbDsl.sendToDb();

        await requestHandler.login(users.validUser2);
        let res = await requestHandler.get('/api/user/profile/commitment', {
            userId: '1', maxItems: 2, skip: 1, isWatching: true
        });
        res.status.should.equal(200);
        res.body.numberOfCommitments.should.equal(4);

        res.body.commitments.length.should.equal(2);
        res.body.commitments[0].commitmentId.should.equal('11');
        res.body.commitments[0].title.should.equal('Das ist ein Commitment');
        res.body.commitments[0].description.should.equal(`commitment11Description`);
        res.body.commitments[0].commitmentSlug.should.equal('das-ist-ein-commitment');
        res.body.commitments[0].imageUrl.should.equal(`${process.env.PUBLIC_IMAGE_BASE_URL}/commitment/11/120x120/title.jpg?v=1111`);
        res.body.commitments[0].created.should.equal(998);
        res.body.commitments[0].numberOfWatches.should.equal(3);
        res.body.commitments[0].numberOfLinkedQuestions.should.equal(1);

        res.body.commitments[1].commitmentId.should.equal('12');
        res.body.commitments[1].title.should.equal('Das ist ein Commitment2');
        res.body.commitments[1].description.should.equal(`commitment12Description`);
        res.body.commitments[1].commitmentSlug.should.equal('das-ist-ein-commitment2');
        res.body.commitments[1].imageUrl.should.equal(`${process.env.PUBLIC_IMAGE_BASE_URL}/commitment/12/120x120/title.jpg`);
        res.body.commitments[1].created.should.equal(997);
        res.body.commitments[1].numberOfWatches.should.equal(1);
        res.body.commitments[1].numberOfLinkedQuestions.should.equal(0);
    });

    it('Get commitments a user is administrating (publicEl, visible)', async function () {

        dbDsl.setUserPrivacy('1', {privacyMode: 'publicEl'});
        await dbDsl.sendToDb();

        await requestHandler.login(users.validUser2);
        let res = await requestHandler.get('/api/user/profile/commitment', {
            userId: '1', maxItems: 2, skip: 1, isWatching: true
        });
        res.status.should.equal(200);
        res.body.numberOfCommitments.should.equal(4);
        res.body.commitments.length.should.equal(2);
    });

    it('Get commitments a user is administrating (publicEl, invisible)', async function () {

        dbDsl.setUserPrivacy('1', {privacyMode: 'publicEl'});
        await dbDsl.sendToDb();

        let res = await requestHandler.get('/api/user/profile/commitment', {
            userId: '1', maxItems: 2, skip: 1, isWatching: true
        });
        res.status.should.equal(401);
    });

    it('Get commitments a user is administrating (onlyContact, visible)', async function () {

        dbDsl.setUserPrivacy('1', {privacyMode: 'onlyContact'});
        dbDsl.createContactConnection('1', '2');
        await dbDsl.sendToDb();

        await requestHandler.login(users.validUser2);
        let res = await requestHandler.get('/api/user/profile/commitment', {
            userId: '1', maxItems: 2, skip: 1, isWatching: true
        });
        res.status.should.equal(200);
        res.body.numberOfCommitments.should.equal(4);
        res.body.commitments.length.should.equal(2);
    });

    it('Get commitments a user is administrating (onlyContact, invisible)', async function () {

        dbDsl.setUserPrivacy('1', {privacyMode: 'onlyContact'});
        await dbDsl.sendToDb();

        await requestHandler.login(users.validUser2);
        let res = await requestHandler.get('/api/user/profile/commitment', {
            userId: '1', maxItems: 2, skip: 1, isWatching: true
        });
        res.status.should.equal(401);
    });

});
