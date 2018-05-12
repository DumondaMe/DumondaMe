'use strict';

let users = require('elyoos-server-test-util').user;
let db = require('elyoos-server-test-util').db;
let dbDsl = require('elyoos-server-test-util').dbDSL;
let requestHandler = require('elyoos-server-test-util').requestHandler;
let moment = require('moment');

describe('Edit youtube answer', function () {

    let startTime;

    beforeEach(async function () {
        await dbDsl.init(3);
        startTime = Math.floor(moment.utc().valueOf() / 1000);
        dbDsl.createQuestion('1', {
            creatorId: '2', question: 'Das ist eine Frage', description: 'description', topics: ['Spiritual', 'Health'],
            language: 'de'
        });
        dbDsl.createYoutubeAnswer('5', {
            creatorId: '1', questionId: '1', created: 555, idOnYoutube: 'Lhku7ZBWEK8',
            link: 'https://www.youtube.com/watch?v=Lhku7ZBWEK8', linkEmbed: 'https://www.youtube.com/embed/Lhku7ZBWEK8'
        });
        dbDsl.createYoutubeAnswer('6', {
            creatorId: '2', questionId: '1', created: 666, idOnYoutube: 'Lhku7ZBWEK8',
            link: 'https://www.youtube.com/watch?v=Lhku7ZBWEK8', linkEmbed: 'https://www.youtube.com/embed/Lhku7ZBWEK8'
        });
        await dbDsl.sendToDb();
    });

    afterEach(function () {
        return requestHandler.logout();
    });

    it('Edit youtube answer', async function () {
        await requestHandler.login(users.validUser);
        let res = await requestHandler.put('/api/user/question/answer/youtube/5', {
            link: 'https://youtu.be/Lhku7ZBWEK7',
            title: 'titleYoutube', description: 'descriptionYoutube'
        });
        res.status.should.equal(200);

        let resp = await db.cypher().match(`(:Question {questionId: '1'})-[:ANSWER]->(answer:Answer {answerId: '5'})`)
            .return(`answer`).end().send();
        resp.length.should.equals(1);
        resp[0].answer.title.should.equals('titleYoutube');
        resp[0].answer.description.should.equals('descriptionYoutube');
        resp[0].answer.idOnYoutube.should.equals('Lhku7ZBWEK7');
        resp[0].answer.link.should.equals('https://youtu.be/Lhku7ZBWEK7');
        resp[0].answer.linkEmbed.should.equals('https://www.youtube.com/embed/Lhku7ZBWEK7');
        resp[0].answer.created.should.equals(555);
        resp[0].answer.modified.should.least(startTime);
    });

    it('The user can only edit the answers he has created.', async function () {
        await requestHandler.login(users.validUser);
        let res = await requestHandler.put('/api/user/question/answer/youtube/6', {
            link: 'https://youtu.be/Lhku7ZBWEK7',
            title: 'titleYoutube', description: 'descriptionYoutube'
        });
        res.status.should.equal(400);

        let resp = await db.cypher().match(`(:Question {questionId: '1'})-[:ANSWER]->
                                            (answer:Answer {answerId: '6'})`)
            .return(`answer`).end().send();
        resp.length.should.equals(1);
        resp[0].answer.title.should.equals('youtube6Title');
        resp[0].answer.description.should.equals('youtube6Description');
        resp[0].answer.idOnYoutube.should.equals('Lhku7ZBWEK8');
        resp[0].answer.link.should.equals('https://www.youtube.com/watch?v=Lhku7ZBWEK8');
        resp[0].answer.linkEmbed.should.equals('https://www.youtube.com/embed/Lhku7ZBWEK8');
        resp[0].answer.created.should.equals(666);
    });
});
