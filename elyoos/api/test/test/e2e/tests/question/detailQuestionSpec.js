'use strict';

let users = require('elyoos-server-test-util').user;
let dbDsl = require('elyoos-server-test-util').dbDSL;
let requestHandler = require('elyoos-server-test-util').requestHandler;
let moment = require('moment');

describe('Getting details of a question', function () {

    let startTime;

    beforeEach(async function () {
        await dbDsl.init(5);
        startTime = Math.floor(moment.utc().valueOf() / 1000);

        dbDsl.createQuestion('1', {
            creatorId: '2', question: 'Das ist eine Frage', description: 'description',
            topic: ['spiritual', 'education'], language: 'de', modified: 700
        });
        dbDsl.createTextAnswer('5', {
            creatorId: '2', questionId:'1', answer: 'Answer', created: 600,
        });
        dbDsl.createTextAnswer('6', {
            creatorId: '3', questionId:'1', answer: 'Answer2',
        });
        dbDsl.createYoutubeAnswer('7', {
            creatorId: '2', questionId: '1', created: 499, idOnYoutube: 'Lhku7ZBWEK8',
            link: 'https://www.youtube.com/watch?v=Lhku7ZBWEK8', linkEmbed: 'https://www.youtube.com/embed/Lhku7ZBWEK8'
        });
    });

    afterEach(function () {
        return requestHandler.logout();
    });

    it('Getting details of a question (answers sorted by date)', async function () {
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

        res.body.answers.length.should.equals(3);
        res.body.answers[0].textId.should.equals('5');
        res.body.answers[0].answer.should.equals('Answer');
        res.body.answers[0].upVotes.should.equals(0);
        res.body.answers[0].created.should.equals(600);
        res.body.answers[0].creator.name.should.equals('user Meier2');
        res.body.answers[0].creator.thumbnailUrl.should.equals('profileImage/2/thumbnail.jpg');

        res.body.answers[1].textId.should.equals('6');
        res.body.answers[1].answer.should.equals('Answer2');
        res.body.answers[1].upVotes.should.equals(0);
        res.body.answers[1].created.should.equals(500);
        res.body.answers[1].creator.name.should.equals('user Meier3');
        res.body.answers[1].creator.thumbnailUrl.should.equals('profileImage/3/thumbnail.jpg');

        res.body.answers[2].youtubeId.should.equals('7');
        res.body.answers[2].linkEmbed.should.equals('https://www.youtube.com/embed/Lhku7ZBWEK8');
        res.body.answers[2].title.should.equals('youtube7Title');
        res.body.answers[2].description.should.equals('youtube7Description');
        res.body.answers[2].upVotes.should.equals(0);
        res.body.answers[2].created.should.equals(499);
        res.body.answers[2].creator.name.should.equals('user Meier2');
        res.body.answers[2].creator.thumbnailUrl.should.equals('profileImage/2/thumbnail.jpg');
    });

    it('Getting details of a question (answers sorted up votes)', async function () {

        dbDsl.upVoteTextAnswer({userId: '1', textId: '6'});
        dbDsl.upVoteYoutubeAnswer({userId: '4', youtubeId: '7'});
        dbDsl.upVoteYoutubeAnswer({userId: '5', youtubeId: '7'});
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

        res.body.answers.length.should.equals(3);
        res.body.answers[0].youtubeId.should.equals('7');
        res.body.answers[0].linkEmbed.should.equals('https://www.youtube.com/embed/Lhku7ZBWEK8');
        res.body.answers[0].title.should.equals('youtube7Title');
        res.body.answers[0].description.should.equals('youtube7Description');
        res.body.answers[0].upVotes.should.equals(2);
        res.body.answers[0].created.should.equals(499);
        res.body.answers[0].creator.name.should.equals('user Meier2');
        res.body.answers[0].creator.thumbnailUrl.should.equals('profileImage/2/thumbnail.jpg');

        res.body.answers[1].textId.should.equals('6');
        res.body.answers[1].answer.should.equals('Answer2');
        res.body.answers[1].upVotes.should.equals(1);
        res.body.answers[1].created.should.equals(500);
        res.body.answers[1].creator.name.should.equals('user Meier3');
        res.body.answers[1].creator.thumbnailUrl.should.equals('profileImage/3/thumbnail.jpg');

        res.body.answers[2].textId.should.equals('5');
        res.body.answers[2].answer.should.equals('Answer');
        res.body.answers[2].upVotes.should.equals(0);
        res.body.answers[2].created.should.equals(600);
        res.body.answers[2].creator.name.should.equals('user Meier2');
        res.body.answers[2].creator.thumbnailUrl.should.equals('profileImage/2/thumbnail.jpg');
    });

    it('Getting details of a question when not logged in (answers sorted by date)', async function () {
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

        res.body.answers.length.should.equals(3);
        res.body.answers[0].textId.should.equals('5');
        res.body.answers[0].answer.should.equals('Answer');
        res.body.answers[0].upVotes.should.equals(0);
        res.body.answers[0].created.should.equals(600);
        res.body.answers[0].creator.name.should.equals('user Meier2');
        res.body.answers[0].creator.thumbnailUrl.should.equals('profileImage/2/thumbnail.jpg');

        res.body.answers[1].textId.should.equals('6');
        res.body.answers[1].answer.should.equals('Answer2');
        res.body.answers[1].upVotes.should.equals(0);
        res.body.answers[1].created.should.equals(500);
        res.body.answers[1].creator.name.should.equals('user Meier3');
        res.body.answers[1].creator.thumbnailUrl.should.equals('profileImage/3/thumbnail.jpg');

        res.body.answers[2].youtubeId.should.equals('7');
        res.body.answers[2].linkEmbed.should.equals('https://www.youtube.com/embed/Lhku7ZBWEK8');
        res.body.answers[2].title.should.equals('youtube7Title');
        res.body.answers[2].description.should.equals('youtube7Description');
        res.body.answers[2].upVotes.should.equals(0);
        res.body.answers[2].created.should.equals(499);
        res.body.answers[2].creator.name.should.equals('user Meier2');
        res.body.answers[2].creator.thumbnailUrl.should.equals('profileImage/2/thumbnail.jpg');
    });
});
