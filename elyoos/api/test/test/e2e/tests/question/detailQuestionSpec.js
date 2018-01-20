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

        dbDsl.createQuestion('1', {
            creatorId: '2', question: 'Das ist eine Frage', description: 'description',
            topic: ['spiritual', 'education'], language: 'de', modified: 700
        });
        dbDsl.createTextAnswer('5', {
            creatorId: '2', questionId:'1', title: 'Answer', description: 'descriptionAnswer', created: 600,
        });
        dbDsl.createTextAnswer('6', {
            creatorId: '3', questionId:'1', title: 'Answer2', description: 'descriptionAnswer2'
        });
    });

    afterEach(function () {
        return requestHandler.logout();
    });

    it('Getting details of a question', async function () {
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
        res.body.topic.length.should.equals(2);
        res.body.topic[0].should.equals('spiritual');
        res.body.topic[1].should.equals('education');

        res.body.textAnswer.length.should.equals(2);
        res.body.textAnswer[0].answerId.should.equals('5');
        res.body.textAnswer[0].title.should.equals('Answer');
        res.body.textAnswer[0].description.should.equals('descriptionAnswer');
        res.body.textAnswer[0].created.should.equals(600);
        res.body.textAnswer[0].creator.name.should.equals('user Meier2');
        res.body.textAnswer[0].creator.thumbnailUrl.should.equals('profileImage/2/thumbnail.jpg');

        res.body.textAnswer[1].answerId.should.equals('6');
        res.body.textAnswer[1].title.should.equals('Answer2');
        res.body.textAnswer[1].description.should.equals('descriptionAnswer2');
        res.body.textAnswer[1].created.should.equals(500);
        res.body.textAnswer[1].creator.name.should.equals('user Meier3');
        res.body.textAnswer[1].creator.thumbnailUrl.should.equals('profileImage/3/thumbnail.jpg');
    });

    it('Getting details of a question when not logged in', async function () {
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
        res.body.topic.length.should.equals(2);
        res.body.topic[0].should.equals('spiritual');
        res.body.topic[1].should.equals('education');

        res.body.textAnswer.length.should.equals(2);
        res.body.textAnswer[0].answerId.should.equals('5');
        res.body.textAnswer[0].title.should.equals('Answer');
        res.body.textAnswer[0].description.should.equals('descriptionAnswer');
        res.body.textAnswer[0].created.should.equals(600);
        res.body.textAnswer[0].creator.name.should.equals('user Meier2');
        res.body.textAnswer[0].creator.thumbnailUrl.should.equals('profileImage/2/thumbnail.jpg');

        res.body.textAnswer[1].answerId.should.equals('6');
        res.body.textAnswer[1].title.should.equals('Answer2');
        res.body.textAnswer[1].description.should.equals('descriptionAnswer2');
        res.body.textAnswer[1].created.should.equals(500);
        res.body.textAnswer[1].creator.name.should.equals('user Meier3');
        res.body.textAnswer[1].creator.thumbnailUrl.should.equals('profileImage/3/thumbnail.jpg');
    });
});
