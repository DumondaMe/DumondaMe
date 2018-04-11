'use strict';

const users = require('elyoos-server-test-util').user;
const dbDsl = require('elyoos-server-test-util').dbDSL;
const requestHandler = require('elyoos-server-test-util').requestHandler;

describe('Search a commitment with fuzzy match', function () {

    before(async function () {
        await dbDsl.init(3);
        dbDsl.createCommitment('1', {
            title: 'Das ist ein Engagement',
            adminId: '2', topics: ['Test1', 'Test2'], language: 'de', created: 700, website: 'https://www.example.org/'
        }, []);

        dbDsl.createCommitment('2', {
            title: 'Wie geht es weiter mit diesem Engagement',
            adminId: '2', topics: ['Test1', 'Test2'], language: 'de', created: 700, website: 'https://www.example.org/'
        }, []);

        await dbDsl.sendToDb();
        await dbDsl.setApocIndex();
    });

    afterEach(function () {
        return requestHandler.logout();
    });

    it('find a commitment where the word is in the middle of the title', async function () {
        await requestHandler.login(users.validUser);
        let res = await requestHandler.get('/api/commitment/search', {query: 'weiter'});
        res.status.should.equal(200);
        res.body.commitments.length.should.equals(1);
        res.body.commitments[0].should.equals('Wie geht es weiter mit diesem Engagement');
    });

    it('find a commitment with two query words', async function () {
        await requestHandler.login(users.validUser);
        let res = await requestHandler.get('/api/commitment/search', {query: 'weiter mit'});
        res.status.should.equal(200);
        res.body.commitments.length.should.equals(1);
        res.body.commitments[0].should.equals('Wie geht es weiter mit diesem Engagement');
    });

});
