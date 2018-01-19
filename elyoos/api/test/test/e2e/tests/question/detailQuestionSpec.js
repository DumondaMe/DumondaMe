'use strict';

let users = require('elyoos-server-test-util').user;
let dbDsl = require('elyoos-server-test-util').dbDSL;
let requestHandler = require('elyoos-server-test-util').requestHandler;
let moment = require('moment');

describe('Getting details of a question', function () {

    let startTime;

    beforeEach(async function () {
        await dbDsl.init(3);
        startTime = Math.floor(moment.utc().valueOf() / 1000);
    });

    afterEach(function () {
        return requestHandler.logout();
    });

    it('Getting details of a question', async function () {
        dbDsl.createQuestion('1', {
            creatorId: '2', question: 'Das ist eine Frage', description: 'description',
            topic: ['spiritual', 'education'], language: 'de', modified: 700
        });
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.get('/api/question/detail/1');
        res.status.should.equal(200);
        res.body.question.should.equals('Das ist eine Frage');
        res.body.description.should.equals('description');
        res.body.created.should.equals(500);
        res.body.modified.should.equals(700);
        res.body.language.should.equals('de');
        res.body.creator.name.should.equals('user Meier2');
        //@todo test with new privacy settings
        res.body.creator.thumbnailUrl.should.equals('profileImage/2/thumbnail.jpg');
        res.body.topic[0].should.equals('spiritual');
        res.body.topic[1].should.equals('education');
    });

    it('Getting details of a question when not logged in', async function () {
        dbDsl.createQuestion('1', {
            creatorId: '2', question: 'Das ist eine Frage', description: 'description',
            topic: ['spiritual', 'education'], language: 'de', modified: 700
        });
        await dbDsl.sendToDb();
        let res = await requestHandler.get('/api/question/detail/1');
        res.status.should.equal(200);
        res.body.question.should.equals('Das ist eine Frage');
        res.body.description.should.equals('description');
        res.body.created.should.equals(500);
        res.body.modified.should.equals(700);
        res.body.language.should.equals('de');
        res.body.creator.name.should.equals('user Meier2');
        //@todo test with new privacy settings
        res.body.creator.thumbnailUrl.should.equals('profileImage/2/thumbnail.jpg');
        res.body.topic[0].should.equals('spiritual');
        res.body.topic[1].should.equals('education');
    });
});
