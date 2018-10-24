'use strict';

const users = require('dumonda-me-server-test-util').user;
const dbDsl = require('dumonda-me-server-test-util').dbDSL;
const requestHandler = require('dumonda-me-server-test-util').requestHandler;

describe('Autocomplete for user, commitment and question search with fuzzy match', function () {

    beforeEach(async function () {
        await dbDsl.init(4);
        dbDsl.createRegion('region-1', {de: 'Region1De', en: 'Region1En'});
        dbDsl.createMainTopic({topicId: 'topic1', descriptionDe: 'topic1De', descriptionEn: 'topic1En'});

        dbDsl.createCommitment('1', {
            title: 'Das ist ein Engagement von Hans Wurst', regions: ['region-1'],
            adminId: '2', topics: ['topic1'], language: 'de', created: 700, website: 'https://www.example.org/'
        }, []);
        dbDsl.createCommitment('2', {
            title: 'Das ist ein Engagement von Hans Wurst', regions: ['region-1'],
            adminId: '2', topics: ['topic1'], language: 'de', created: 700, website: 'https://www.example.org/'
        }, []);
        dbDsl.createCommitment('3', {
            title: 'Irgend ein Engagement', regions: ['region-1'],
            adminId: '2', topics: ['topic1'], language: 'de', created: 700, website: 'https://www.example.org/'
        }, []);

        dbDsl.createQuestion('10', {
            creatorId: '2', question: 'Das ist eine Frage von Hans Wur', created: 500, modified: 700,
            description: 'Test dumonda.me change the world1', topics: ['topic1'], language: 'de'
        });
        dbDsl.createQuestion('11', {
            creatorId: '2', question: 'Das ist eine Frage von Hans Wur', created: 500, modified: 700,
            description: 'Test dumonda.me change the world1', topics: ['topic1'], language: 'de'
        });
        dbDsl.createQuestion('12', {
            creatorId: '2', question: 'Irgend eine Frage', description: 'Test dumonda.me change the world2',
            topics: ['topic1'], language: 'de', created: 500, modified: 700
        });

        dbDsl.setUserName('3', {name: 'Hans Wurst'});
        dbDsl.setUserName('4', {name: 'Hans Wurst'})

    });

    afterEach(function () {
        return requestHandler.logout();
    });

    it('Autocomplete user, commitment and question (user not logged in)', async function () {
        await dbDsl.sendToDb();
        await dbDsl.setApocIndex();
        let res = await requestHandler.get('/api/search/autocomplete', {query: 'Hans Wurst'});
        res.status.should.equal(200);
        res.body.length.should.equals(3);
        res.body[0].should.equals('Hans Wurst');
        res.body[1].should.equals('Das ist ein Engagement von Hans Wurst');
        res.body[2].should.equals('Das ist eine Frage von Hans Wur');
    });

    it('Autocomplete user, commitment and question (user is logged in)', async function () {
        await dbDsl.sendToDb();
        await dbDsl.setApocIndex();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.get('/api/search/autocomplete', {query: 'Hans Wurst'});
        res.status.should.equal(200);
        res.body.length.should.equals(3);
        res.body[0].should.equals('Hans Wurst');
        res.body[1].should.equals('Das ist ein Engagement von Hans Wurst');
        res.body[2].should.equals('Das ist eine Frage von Hans Wur');
    });
});
