'use strict';

const users = require('elyoos-server-test-util').user;
const dbDsl = require('elyoos-server-test-util').dbDSL;
const requestHandler = require('elyoos-server-test-util').requestHandler;

describe('Search a topic with fuzzy match', function () {

    before(async function () {
        await dbDsl.init(3);
        dbDsl.createTopic('Irgendwas Weiters');

        dbDsl.createCommitment('1', {
            adminId: '2', topics: ['Test1', 'Test2'], language: 'de', created: 700, website: 'https://www.example.org/'
        }, []);
        dbDsl.createQuestion('2', {
            creatorId: '2', question: 'Das ist eine Frage', description: 'description', topics: ['Test2'],
            language: 'de'
        });
        dbDsl.createQuestion('3', {
            creatorId: '2', question: 'Das ist eine Frage2', description: 'description2', topics: ['Irgendwas3'],
            language: 'de'
        });

        await dbDsl.sendToDb();
        await dbDsl.setApocIndex();
    });

    afterEach(function () {
        return requestHandler.logout();
    });

    it('Get list of keywords (Tet)', async function () {
        await requestHandler.login(users.validUser);
        let res = await requestHandler.get('/api/topic/search', {query: 'Tet'});
        res.status.should.equal(200);
        res.body.topics.length.should.equals(2);
        res.body.topics[0].should.equals('Test1');
        res.body.topics[1].should.equals('Test2');
    });

    it('Get list of keywords (Irgendwas Weitr)', async function () {
        await requestHandler.login(users.validUser);
        let res = await requestHandler.get('/api/topic/search', {query: 'irgendwas Weitr'});
        res.status.should.equal(200);
        res.body.topics.length.should.equals(2);
        res.body.topics[0].should.equals('Irgendwas Weiters');
        res.body.topics[1].should.equals('Irgendwas3');
    });
});
