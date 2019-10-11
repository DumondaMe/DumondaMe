'use strict';

let users = require('dumonda-me-server-test-util').user;
let dbDsl = require('dumonda-me-server-test-util').dbDSL;
let requestHandler = require('dumonda-me-server-test-util').requestHandler;
let moment = require('moment');

//Only testing harvesting specific response. Detail Test in getQuestionSpec.
describe('Getting details of a question created or answered by a harvesting user', function () {

    let startTime;

    beforeEach(async function () {
        await dbDsl.init(4);
        await requestHandler.logout();
        startTime = Math.floor(moment.utc().valueOf() / 1000);

        dbDsl.createMainTopic({topicId: 'topic1', descriptionDe: 'topic1De', descriptionEn: 'topic1En'});

        dbDsl.createQuestion('1', {
            creatorId: '1', question: 'Das ist eine Frage', description: 'Test dumonda.me change the world',
            topics: ['topic1'], language: 'de', modified: 700
        });
        dbDsl.createTextAnswer('5', {
            creatorId: '2', questionId: '1', answer: 'Answer', created: 600,
        });
    });

    afterEach(function () {
        return requestHandler.logout();
    });

    it('Getting details of a question created by a harvesting user', async function () {
        dbDsl.setUserIsHarvestingUser('1', {start: 100, end: 200, link: 'https://www.link.ch', address: 'Milky Way'});
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.get('/api/question/detail/1', {language: 'de'});
        res.status.should.equal(200);
        res.body.questionId.should.equals('1');
        res.body.creator.userId.should.equals('1');
        res.body.creator.isHarvestingUser.should.equals(true);
        res.body.harvestingUser.userId.should.equals('1');
        res.body.harvestingUser.name.should.equals('user Meier');
        res.body.harvestingUser.slug.should.equals('user-meier');
        res.body.harvestingUser.userImage.should.equals('profileImage/1/profilePreview.jpg');
        res.body.harvestingUser.createdQuestion.should.equals(true);
        res.body.harvestingUser.answeredQuestion.should.equals(false);
    });

    it('Getting details of a question answered by a harvesting user', async function () {
        dbDsl.setUserIsHarvestingUser('2', {start: 100, end: 200, link: 'https://www.link.ch', address: 'Milky Way'});
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.get('/api/question/detail/1', {language: 'de'});
        res.status.should.equal(200);
        res.body.questionId.should.equals('1');
        res.body.creator.isHarvestingUser.should.equals(false);
        res.body.harvestingUser.userId.should.equals('2');
        res.body.harvestingUser.name.should.equals('user Meier2');
        res.body.harvestingUser.slug.should.equals('user-meier2');
        res.body.harvestingUser.userImage.should.equals('profileImage/2/profilePreview.jpg');
        res.body.harvestingUser.createdQuestion.should.equals(false);
        res.body.harvestingUser.answeredQuestion.should.equals(true);

        res.body.answers.length.should.equals(1);
        res.body.answers[0].answerId.should.equals('5');
        res.body.answers[0].creator.userId.should.equals('2');
        res.body.answers[0].creator.isHarvestingUser.should.equals(true);
    });

    it('Getting details of a question created and answered by a harvesting user', async function () {
        dbDsl.setUserIsHarvestingUser('1', {start: 100, end: 200, link: 'https://www.link.ch', address: 'Milky Way'});
        dbDsl.createTextAnswer('6', {
            creatorId: '1', questionId: '1', answer: 'Answer', created: 700,
        });
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.get('/api/question/detail/1', {language: 'de'});
        res.status.should.equal(200);
        res.body.questionId.should.equals('1');
        res.body.creator.isHarvestingUser.should.equals(true);
        res.body.harvestingUser.userId.should.equals('1');
        res.body.harvestingUser.name.should.equals('user Meier');
        res.body.harvestingUser.slug.should.equals('user-meier');
        res.body.harvestingUser.userImage.should.equals('profileImage/1/profilePreview.jpg');
        res.body.harvestingUser.createdQuestion.should.equals(true);
        res.body.harvestingUser.answeredQuestion.should.equals(true);

        res.body.answers.length.should.equals(2);

        res.body.answers[0].answerId.should.equals('6');
        res.body.answers[0].creator.userId.should.equals('1');
        res.body.answers[0].creator.isHarvestingUser.should.equals(true);

        res.body.answers[1].answerId.should.equals('5');
        res.body.answers[1].creator.userId.should.equals('2');
        res.body.answers[1].creator.isHarvestingUser.should.equals(false);
    });
});
