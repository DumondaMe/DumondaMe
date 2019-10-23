'use strict';

let users = require('dumonda-me-server-test-util').user;
let db = require('dumonda-me-server-test-util').db;
let dbDsl = require('dumonda-me-server-test-util').dbDSL;
let requestHandler = require('dumonda-me-server-test-util').requestHandler;
let moment = require('moment');

describe('Creating new default answer', function () {

    let startTime;

    beforeEach(async function () {
        await dbDsl.init(3);
        startTime = Math.floor(moment.utc().valueOf() / 1000);
        dbDsl.createMainTopic({topicId: 'topic1', descriptionDe: 'topic1De', descriptionEn: 'topic1En'});
        dbDsl.createMainTopic({topicId: 'topic2', descriptionDe: 'topic2De', descriptionEn: 'topic2En'});

        dbDsl.createRegion('international', {de: 'internationalDe', en: 'internationalEn'});
        dbDsl.createRegion('region-1', {parentRegionId: 'international', de: 'Region1De', en: 'Region1En'});

        dbDsl.createQuestion('1', {
            creatorId: '2', question: 'Das ist eine Frage', description: 'description', topics: ['topic1', 'topic2'],
            language: 'de'
        });
        dbDsl.createQuestion('2', {
            creatorId: '3', question: 'Das ist eine Frage2', description: 'description2', topics: ['topic1'],
            language: 'en'
        });
        dbDsl.createCommitment('10', {
            adminId: '2', topics: ['topic1', 'topic2'], language: 'de', created: 700, modified: 701,
            website: 'https://www.example.org/', regions: ['region-1'], title: 'Das ist ein Engagement'
        });
    });

    afterEach(function () {
        return requestHandler.logout();
    });

    it('Creating new default answer (only text)', async function () {
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.post('/api/user/question/answer/default/1', {
            answer: 'answer'
        });
        res.status.should.equal(200);
        res.body.created.should.least(startTime);
        res.body.creator.name.should.equals('user Meier');
        res.body.creator.slug.should.equals('user-meier');
        res.body.creator.isLoggedInUser.should.equals(true);
        res.body.creator.isTrustUser.should.equals(false);
        res.body.creator.userImage.should.equals('profileImage/1/thumbnail.jpg');
        res.body.creator.userImagePreview.should.equals('profileImage/1/profilePreview.jpg');

        let resp = await db.cypher().match(`(:Question {questionId: '1'})-[:ANSWER]->(answer:Default:Answer)<-[:IS_CREATOR]-(user:User)`)
            .return(`answer, user`).end().send();
        resp.length.should.equals(1);
        resp[0].answer.answerId.should.equals(res.body.answerId);
        resp[0].answer.answer.should.equals('answer');
        resp[0].answer.created.should.equals(res.body.created);
        resp[0].user.userId.should.equals('1');
    });

    it('Default answer contains links', async function () {
        dbDsl.createLinkAnswer('20', {
            creatorId: '2', questionId: '1', created: 666,
            link: 'https://www.dumonda.me', pageType: 'blog'
        });
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.post('/api/user/question/answer/default/1', {
            answer: 'answer www.dumonda.me and https://www.wwf.ch'
        });
        res.status.should.equal(406);
        res.body.links.length.should.equals(2);
        res.body.links[0].url.should.equals('http://www.dumonda.me');
        res.body.links[0].usedAsAnswer.should.equals(true);
        res.body.links[0].answerId.should.equals('20');
        res.body.links[1].url.should.equals('https://www.wwf.ch');
        res.body.links[1].usedAsAnswer.should.equals(false);
        res.body.youtube.length.should.equals(0);

        let resp = await db.cypher().match(`(:Question {questionId: '1'})-[:ANSWER]->(answer:Default:Answer)<-[:IS_CREATOR]-(user:User)`)
            .return(`answer, user`).end().send();
        resp.length.should.equals(0);
    });

    it('Default answer contains youtube videos', async function () {
        dbDsl.createYoutubeAnswer('20', {
            creatorId: '2', questionId: '1', created: 666, idOnYoutube: 'MbV4wjkYtYc',
            link: 'https://www.youtube.com/watch?v=MbV4wjkYtYc', linkEmbed: 'https://www.youtube.com/embed/MbV4wjkYtYc'
        });
        dbDsl.createYoutubeAnswer('21', {
            creatorId: '2', questionId: '2', created: 666, idOnYoutube: 'anU86pXngMs',
            link: 'https://www.youtube.com/watch?v=anU86pXngMs', linkEmbed: 'https://www.youtube.com/embed/anU86pXngMs'
        });
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.post('/api/user/question/answer/default/1', {
            answer: 'answer https://www.youtube.com/watch?v=MbV4wjkYtYc and https://www.youtube.com/watch?v=anU86pXngMs'
        });
        res.status.should.equal(406);
        res.body.youtube.length.should.equals(2);
        res.body.youtube[0].url.should.equals('https://www.youtube.com/watch?v=MbV4wjkYtYc');
        res.body.youtube[0].usedAsAnswer.should.equals(true);
        res.body.youtube[0].answerId.should.equals('20');
        res.body.youtube[1].url.should.equals('https://www.youtube.com/watch?v=anU86pXngMs');
        res.body.youtube[1].usedAsAnswer.should.equals(false);
        res.body.links.length.should.equals(0);

        let resp = await db.cypher().match(`(:Question {questionId: '1'})-[:ANSWER]->(answer:Default:Answer)<-[:IS_CREATOR]-(user:User)`)
            .return(`answer, user`).end().send();
        resp.length.should.equals(0);
    });

    it('Default answer contains youtube videos and links', async function () {
        dbDsl.createCommitment('11', {
            adminId: '2', topics: ['topic1', 'topic2'], language: 'en', created: 700, modified: 701,
            website: 'http://www.dumonda.me', regions: ['region-1'], title: 'Das ist ein englisch Engagement'
        });
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.post('/api/user/question/answer/default/1', {
            answer: 'answer https://www.youtube.com/watch?v=MbV4wjkYtYc and https://www.youtube.com/watch?v=anU86pXngMs and www.dumonda.me and https://www.wwf.ch'
        });
        res.status.should.equal(406);
        res.body.commitment.length.should.equals(0);
        res.body.youtube.length.should.equals(2);
        res.body.youtube[0].url.should.equals('https://www.youtube.com/watch?v=MbV4wjkYtYc');
        res.body.youtube[0].usedAsAnswer.should.equals(false);
        res.body.youtube[1].url.should.equals('https://www.youtube.com/watch?v=anU86pXngMs');
        res.body.youtube[1].usedAsAnswer.should.equals(false);
        res.body.links.length.should.equals(2);
        res.body.links[0].url.should.equals('http://www.dumonda.me');
        res.body.links[0].usedAsAnswer.should.equals(false);
        res.body.links[1].url.should.equals('https://www.wwf.ch');
        res.body.links[1].usedAsAnswer.should.equals(false);

        let resp = await db.cypher().match(`(:Question {questionId: '1'})-[:ANSWER]->(answer:Default:Answer)<-[:IS_CREATOR]-(user:User)`)
            .return(`answer, user`).end().send();
        resp.length.should.equals(0);
    });

    it('Default answer contains link of commitment', async function () {
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.post('/api/user/question/answer/default/1', {
            answer: 'answer https://www.example.org/test'
        });
        res.status.should.equal(406);
        res.body.youtube.length.should.equals(0);
        res.body.links.length.should.equals(1);
        res.body.links[0].url.should.equals('https://www.example.org/test');
        res.body.links[0].usedAsAnswer.should.equals(false);
        res.body.commitment.length.should.equals(1);
        res.body.commitment[0].commitmentId.should.equals('10');
        res.body.commitment[0].usedAsAnswer.should.equals(false);
        res.body.commitment[0].title.should.equals('Das ist ein Engagement');
        res.body.commitment[0].description.should.equals('commitment10Description');
        res.body.commitment[0].imageUrl.should.equals(`${process.env.PUBLIC_IMAGE_BASE_URL}/commitment/10/120x120/title.jpg?v=701`);

        let resp = await db.cypher().match(`(:Question {questionId: '1'})-[:ANSWER]->(answer:Default:Answer)<-[:IS_CREATOR]-(user:User)`)
            .return(`answer, user`).end().send();
        resp.length.should.equals(0);
    });

    it('Default answer contains link of already as answer used commitment', async function () {
        dbDsl.createCommitmentAnswer('20', {
            creatorId: '2', questionId: '1', commitmentId: '10', created: 666, description: 'test2'
        });
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.post('/api/user/question/answer/default/1', {
            answer: 'answer https://www.example.org/test'
        });
        res.status.should.equal(406);
        res.body.youtube.length.should.equals(0);
        res.body.links.length.should.equals(1);
        res.body.links[0].url.should.equals('https://www.example.org/test');
        res.body.links[0].usedAsAnswer.should.equals(false);
        res.body.commitment.length.should.equals(1);
        res.body.commitment[0].commitmentId.should.equals('10');
        res.body.commitment[0].usedAsAnswer.should.equals(true);
        res.body.commitment[0].title.should.equals('Das ist ein Engagement');
        res.body.commitment[0].description.should.equals('commitment10Description');
        res.body.commitment[0].imageUrl.should.equals(`${process.env.PUBLIC_IMAGE_BASE_URL}/commitment/10/120x120/title.jpg?v=701`);

        let resp = await db.cypher().match(`(:Question {questionId: '1'})-[:ANSWER]->(answer:Default:Answer)<-[:IS_CREATOR]-(user:User)`)
            .return(`answer, user`).end().send();
        resp.length.should.equals(0);
    });

    it('Default answer contains link of commitment with other language', async function () {
        dbDsl.createCommitment('11', {
            adminId: '2', topics: ['topic1', 'topic2'], language: 'en', created: 700, modified: 701,
            website: 'https://www.example2.org/', regions: ['region-1'], title: 'Das ist ein englisch Engagement'
        });
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.post('/api/user/question/answer/default/1', {
            answer: 'answer https://www.example2.org/test'
        });
        res.status.should.equal(406);
        res.body.youtube.length.should.equals(0);
        res.body.links.length.should.equals(1);
        res.body.links[0].url.should.equals('https://www.example2.org/test');
        res.body.links[0].usedAsAnswer.should.equals(false);
        res.body.commitment.length.should.equals(0);
    });

    it('Creating default answer even with links', async function () {
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.post('/api/user/question/answer/default/1', {
            answer: 'answer https://www.youtube.com/watch?v=MbV4wjkYtYc and https://www.youtube.com/watch?v=anU86pXngMs and www.dumonda.me and https://www.wwf.ch',
            createAnswerWithLink: true
        });
        res.status.should.equal(200);
        res.body.answerHtml.should.equals('answer <a href="https://www.youtube.com/watch?v=MbV4wjkYtYc" class="linkified" target="_blank" rel="noopener">https://www.youtube.com/watch?v=MbV4wjkYtYc</a> and <a href="https://www.youtube.com/watch?v=anU86pXngMs" class="linkified" target="_blank" rel="noopener">https://www.youtube.com/watch?v=anU86pXngMs</a> and <a href="http://www.dumonda.me" class="linkified" target="_blank" rel="noopener">www.dumonda.me</a> and <a href="https://www.wwf.ch" class="linkified" target="_blank" rel="noopener">https://www.wwf.ch</a>');
        res.body.created.should.least(startTime);
        res.body.creator.name.should.equals('user Meier');
        res.body.creator.slug.should.equals('user-meier');
        res.body.creator.isLoggedInUser.should.equals(true);
        res.body.creator.isTrustUser.should.equals(false);
        res.body.creator.userImage.should.equals('profileImage/1/thumbnail.jpg');
        res.body.creator.userImagePreview.should.equals('profileImage/1/profilePreview.jpg');

        let resp = await db.cypher().match(`(:Question {questionId: '1'})-[:ANSWER]->(answer:Default:Answer)<-[:IS_CREATOR]-(user:User)`)
            .return(`answer, user`).end().send();
        resp.length.should.equals(1);
        resp[0].answer.answerId.should.equals(res.body.answerId);
        resp[0].answer.answer.should.equals('answer https://www.youtube.com/watch?v=MbV4wjkYtYc and https://www.youtube.com/watch?v=anU86pXngMs and www.dumonda.me and https://www.wwf.ch');
        resp[0].answer.created.should.equals(res.body.created);
        resp[0].user.userId.should.equals('1');
    });

    it('Prevent xss attack when creating a default answer', async function () {
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.post('/api/user/question/answer/default/1', {
            answer: 'answer<script>alert()</script>'
        });
        res.status.should.equal(200);

        let resp = await db.cypher().match(`(:Question {questionId: '1'})-[:ANSWER]->(answer:Default:Answer)<-[:IS_CREATOR]-(user:User)`)
            .return(`answer, user`).end().send();
        resp.length.should.equals(1);
        resp[0].answer.answer.should.equals('answer');
    });

    it('Only allowed to add an default answer as logged in user', async function () {
        await dbDsl.sendToDb();
        let res = await requestHandler.post('/api/user/question/answer/default/1', {
            answer: 'answer'
        });
        res.status.should.equal(401);
    });
});
