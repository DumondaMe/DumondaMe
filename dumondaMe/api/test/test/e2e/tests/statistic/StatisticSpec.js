'use strict';

const dbDsl = require('dumonda-me-server-test-util').dbDSL;
const requestHandler = require('dumonda-me-server-test-util').requestHandler;

describe('Get statistic to DumondaMe', function () {

    beforeEach(async function () {
        await dbDsl.init(6);
        dbDsl.createRegion('region-1', {de: 'Region1De', en: 'Region1En'});
        dbDsl.createMainTopic({topicId: 'topic1', descriptionDe: 'topic1De', descriptionEn: 'topic1En'});

        dbDsl.createQuestion('10', {
            creatorId: '2', question: 'Das ist eine Frage', created: 500, modified: 700,
            description: 'Test dumonda.me change the world1', topics: ['topic1'], language: 'de'
        });
        dbDsl.createBookAnswer('100', {
            creatorId: '2', questionId: '10', created: 601, authors: 'Radisli', googleBookId: '1234',
            hasPreviewImage: true
        });
        dbDsl.createQuestion('11', {
            creatorId: '2', question: 'Das ist eine Frage', created: 500, modified: 700,
            description: 'Test dumonda.me change the world1', topics: ['topic1'], language: 'de'
        });
        dbDsl.createBookAnswer('101', {
            creatorId: '2', questionId: '11', created: 601, authors: 'Radisli', googleBookId: '1234',
            hasPreviewImage: true
        });
        dbDsl.createBookAnswer('102', {
            creatorId: '2', questionId: '11', created: 601, authors: 'Radisli', googleBookId: '1234',
            hasPreviewImage: true
        });
        dbDsl.createBookAnswer('103', {
            creatorId: '2', questionId: '11', created: 601, authors: 'Radisli', googleBookId: '1234',
            hasPreviewImage: true
        });
        dbDsl.createCommitment('1', {
            title: 'Das ist eine Frage', regions: ['region-1'],
            adminId: '2', topics: ['topic1'], language: 'de', created: 700, modified: 777,
            website: 'https://www.example.org/'
        }, []);
        dbDsl.createCommitment('2', {
            title: 'Das ist eine Frage', regions: ['region-1'],
            adminId: '3', topics: ['topic1'], language: 'de', created: 700, modified: 777,
            website: 'https://www.example.org/'
        }, []);
        dbDsl.createCommitment('3', {
            title: 'Das ist eine Frage', regions: ['region-1'],
            adminId: '4', topics: ['topic1'], language: 'de', created: 700, modified: 777,
            website: 'https://www.example.org/'
        }, []);
    });

    afterEach(function () {
        return requestHandler.logout();
    });

    it('Get number of registered user, questions, answers and commitments', async function () {
        dbDsl.setUserIsHarvestingUser('6', {start: 100, end: 200, link: 'https://www.link.ch', address: 'Milky Way'});
        await dbDsl.sendToDb();
        let res = await requestHandler.get('/api/statistic');
        res.status.should.equal(200);
        res.body.numberOfUsers.should.equals(5);
        res.body.numberOfCommitments.should.equals(3);
        res.body.numberOfQuestions.should.equals(2);
        res.body.numberOfAnswers.should.equals(4);
    });
});
