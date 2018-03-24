'use strict';

let users = require('elyoos-server-test-util').user;
let db = require('elyoos-server-test-util').db;
let dbDsl = require('elyoos-server-test-util').dbDSL;
let requestHandler = require('elyoos-server-test-util').requestHandler;
let moment = require('moment');
let should = require('chai').should();

describe('Creating youtube answer', function () {

    let startTime;

    beforeEach(async function () {
        await dbDsl.init(3);
        startTime = Math.floor(moment.utc().valueOf() / 1000);
        dbDsl.createQuestion('1', {
            creatorId: '2', question: 'Das ist eine Frage', description: 'description', topics: ['Spiritual'],
            language: 'de'
        });
        dbDsl.createQuestion('2', {
            creatorId: '3', question: 'Das ist eine Frage2', description: 'description2', topics: ['Health', 'Spiritual'],
            language: 'en'
        });
        dbDsl.createQuestion('3', {
            creatorId: '3', question: 'Das ist eine Frage3', description: 'description3', topics: ['Health'],
            language: 'fr'
        });
    });

    afterEach(function () {
        return requestHandler.logout();
    });

    it('Creating not in elyoos existing youtube answer', async function () {
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.post('/api/user/question/answer/youtube/1', {
            link: 'https://www.youtube.com/watch?v=Lhku7ZBWEK8',
            title: 'titleYoutube', description: 'descriptionYoutube'
        });
        res.status.should.equal(200);
        res.body.created.should.least(startTime);
        res.body.idOnYoutube.should.equals('Lhku7ZBWEK8');
        res.body.creator.name.should.equals('user Meier');
        res.body.creator.thumbnailUrl.should.equals('profileImage/1/thumbnail.jpg');

        let resp = await db.cypher().match(`(:Question {questionId: '1'})-[:ANSWER]->(answer:Youtube:Answer)<-[:IS_CREATOR]-(user:User)`)
            .optionalMatch(`(answer)-[:ORIGINAL]->(original)`)
            .return(`answer, user, original`).end().send();
        resp.length.should.equals(1);
        resp[0].answer.answerId.should.equals(res.body.answerId);
        resp[0].answer.idOnYoutube.should.equals('Lhku7ZBWEK8');
        resp[0].answer.title.should.equals('titleYoutube');
        resp[0].answer.description.should.equals('descriptionYoutube');
        resp[0].answer.link.should.equals('https://www.youtube.com/watch?v=Lhku7ZBWEK8');
        resp[0].answer.linkEmbed.should.equals('https://www.youtube.com/embed/Lhku7ZBWEK8');
        resp[0].answer.created.should.equals(res.body.created);
        resp[0].user.userId.should.equals('1');
        should.not.exist(resp[0].original);
    });

    it('Create a youtube answer that was already used for another question', async function () {
        dbDsl.createYoutubeAnswer('10', {
            creatorId: '2', questionId: '2', created: 500, idOnYoutube: 'Lhku7ZBWEK8',
            link: 'https://www.youtube.com/watch?v=Lhku7ZBWEK8', linkEmbed: 'https://www.youtube.com/embed/Lhku7ZBWEK8'
        });

        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.post('/api/user/question/answer/youtube/1', {
            link: 'https://youtu.be/Lhku7ZBWEK8',
            title: 'titleYoutube', description: 'descriptionYoutube'
        });
        res.status.should.equal(200);
        res.body.created.should.least(startTime);
        res.body.idOnYoutube.should.equals('Lhku7ZBWEK8');
        res.body.creator.name.should.equals('user Meier');
        res.body.creator.thumbnailUrl.should.equals('profileImage/1/thumbnail.jpg');

        let resp = await db.cypher().match(`(:Question {questionId: '1'})-[:ANSWER]->(answer:Youtube:Answer)<-[:IS_CREATOR]-(user:User)`)
            .optionalMatch(`(answer)-[:ORIGINAL]->(original:Youtube {answerId: '10'})`)
            .return(`answer, user, original`).end().send();
        resp.length.should.equals(1);
        resp[0].answer.answerId.should.equals(res.body.answerId);
        resp[0].answer.idOnYoutube.should.equals('Lhku7ZBWEK8');
        resp[0].answer.title.should.equals('titleYoutube');
        resp[0].answer.description.should.equals('descriptionYoutube');
        resp[0].answer.link.should.equals('https://youtu.be/Lhku7ZBWEK8');
        resp[0].answer.linkEmbed.should.equals('https://www.youtube.com/embed/Lhku7ZBWEK8');
        resp[0].answer.created.should.equals(res.body.created);
        resp[0].user.userId.should.equals('1');
        should.exist(resp[0].original);
    });

    it('Create a youtube answer that was already used for other questions', async function () {
        dbDsl.createYoutubeAnswer('10', {
            creatorId: '2', questionId: '2', created: 500, idOnYoutube: 'Lhku7ZBWEK8',
            link: 'https://www.youtube.com/watch?v=Lhku7ZBWEK8', linkEmbed: 'https://www.youtube.com/embed/Lhku7ZBWEK8'
        });
        dbDsl.createYoutubeAnswer('11', {
            creatorId: '2', questionId: '3', created: 499, idOnYoutube: 'Lhku7ZBWEK8',
            link: 'https://www.youtube.com/watch?v=Lhku7ZBWEK8', linkEmbed: 'https://www.youtube.com/embed/Lhku7ZBWEK8'
        });
        dbDsl.setOriginalAnswer({answerId: '10', originalAnswerId: '11'});

        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.post('/api/user/question/answer/youtube/1', {
            link: 'https://www.youtube.com/watch?v=Lhku7ZBWEK8',
            title: 'titleYoutube', description: 'descriptionYoutube'
        });
        res.status.should.equal(200);
        res.body.created.should.least(startTime);
        res.body.idOnYoutube.should.equals('Lhku7ZBWEK8');
        res.body.creator.name.should.equals('user Meier');
        res.body.creator.thumbnailUrl.should.equals('profileImage/1/thumbnail.jpg');

        let resp = await db.cypher().match(`(:Question {questionId: '1'})-[:ANSWER]->(answer:Youtube:Answer)<-[:IS_CREATOR]-(user:User)`)
            .optionalMatch(`(answer)-[:ORIGINAL]->(original:Youtube {answerId: '11'})`)
            .return(`answer, user, original`).end().send();
        resp.length.should.equals(1);
        resp[0].answer.answerId.should.equals(res.body.answerId);
        resp[0].answer.idOnYoutube.should.equals('Lhku7ZBWEK8');
        resp[0].answer.title.should.equals('titleYoutube');
        resp[0].answer.description.should.equals('descriptionYoutube');
        resp[0].answer.link.should.equals('https://www.youtube.com/watch?v=Lhku7ZBWEK8');
        resp[0].answer.linkEmbed.should.equals('https://www.youtube.com/embed/Lhku7ZBWEK8');
        resp[0].answer.created.should.equals(res.body.created);
        resp[0].user.userId.should.equals('1');
        should.exist(resp[0].original);
    });

    it('Creating youtube answer fails because youtube video is already used for question', async function () {

        dbDsl.createYoutubeAnswer('10', {
            creatorId: '2', questionId: '1', created: 500, idOnYoutube: 'Lhku7ZBWEK8',
            link: 'https://www.youtube.com/watch?v=Lhku7ZBWEK8', linkEmbed: 'https://www.youtube.com/embed/Lhku7ZBWEK8'
        });

        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.post('/api/user/question/answer/youtube/1', {
            link: 'https://www.youtube.com/watch?v=Lhku7ZBWEK8',
            title: 'titleYoutube', description: 'descriptionYoutube'
        });
        res.status.should.equal(400);
        res.body.errorCode.should.equal(2);

        let resp = await db.cypher().match(`(:Question {questionId: '1'})-[:ANSWER]->(answer:Youtube)<-[:IS_CREATOR]-(user:User)`)
            .return(`answer, user`).end().send();
        resp.length.should.equals(1);
    });

    it('Youtube id can not be parsed', async function () {
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.post('/api/user/question/answer/youtube/1', {
            link: 'https://www.youtube.com/watch?r=Lhku7ZBWEK8',
            title: 'titleYoutube', description: 'descriptionYoutube'
        });
        res.status.should.equal(400);
        res.body.errorCode.should.equal(1);

        let resp = await db.cypher().match(`(:Question {questionId: '1'})-[:ANSWER]->(answer:Youtube)<-[:IS_CREATOR]-(user:User)`)
            .return(`answer, user`).end().send();
        resp.length.should.equals(0);
    });

    it('Deny invalid youtube link', async function () {
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.post('/api/user/question/answer/youtube/1', {
            link: 'https://www.youube.com/watch?v=Lhku7ZBWEK8',
            title: 'titleYoutube', description: 'descriptionYoutube'
        });
        res.status.should.equal(400);
    });

    it('Deny embed youtube link', async function () {
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.post('/api/user/question/answer/youtube/1', {
            link: 'https://www.youtube.com/embed/-YWyd5Vz3AY',
            title: 'titleYoutube', description: 'descriptionYoutube'
        });
        res.status.should.equal(400);
    });

    it('Only allowed to add a youtube answer as logged in user', async function () {
        await dbDsl.sendToDb();
        let res = await requestHandler.post('/api/user/question/answer/youtube/1', {
            title: 'title', description: 'description'
        });
        res.status.should.equal(401);
    });
});
