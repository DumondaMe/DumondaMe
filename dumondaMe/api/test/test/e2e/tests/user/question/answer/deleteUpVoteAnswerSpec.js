'use strict';

let users = require('dumonda-me-server-test-util').user;
let db = require('dumonda-me-server-test-util').db;
let dbDsl = require('dumonda-me-server-test-util').dbDSL;
let requestHandler = require('dumonda-me-server-test-util').requestHandler;
let moment = require('moment');

describe('Delete up votes for answers', function () {

    let startTime;

    beforeEach(async function () {
        await dbDsl.init(3);
        startTime = Math.floor(moment.utc().valueOf() / 1000);
        dbDsl.createQuestion('1', {
            creatorId: '2', question: 'Das ist eine Frage', description: 'description', topics: ['Spiritual', 'Health'],
            language: 'de'
        });
    });

    afterEach(function () {
        return requestHandler.logout();
    });

    it('Delete up vote for a text answer', async function () {
        dbDsl.createTextAnswer('5', {
            creatorId: '3', questionId:'1', answer: 'Answer'
        });
        dbDsl.upVoteAnswer({userId: '1', answerId: '5'});
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.del('/api/user/question/answer/upVote/5');
        res.status.should.equal(200);

        let resp = await db.cypher().match(`(answer:Text:Answer)<-[:UP_VOTE]-(user:User {userId: '1'})`)
            .return(`user`).end().send();
        resp.length.should.equals(0);
    });

    it('Delete up vote for a youtube answer', async function () {
        dbDsl.createYoutubeAnswer('5', {
            creatorId: '3', questionId: '1', created: 500, idOnYoutube: 'Lhku7ZBWEK8',
            link: 'https://www.youtube.com/watch?v=Lhku7ZBWEK8', linkEmbed: 'https://www.youtube.com/embed/Lhku7ZBWEK8'
        });
        dbDsl.upVoteAnswer({userId: '1', answerId: '5'});
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.del('/api/user/question/answer/upVote/5');
        res.status.should.equal(200);

        let resp = await db.cypher().match(`(answer:Youtube:Answer)<-[:UP_VOTE]-(user:User {userId: '1'})`)
            .return(`user`).end().send();
        resp.length.should.equals(0);
    });


    it('Only allowed to delete up vote of an answer as logged in user', async function () {
        dbDsl.createTextAnswer('5', {
            creatorId: '3', questionId:'1', answer: 'Answer'
        });
        dbDsl.upVoteAnswer({userId: '1', answerId: '5'});
        await dbDsl.sendToDb();
        let res = await requestHandler.del('/api/user/question/answer/upVote/5');
        res.status.should.equal(401);

        let resp = await db.cypher().match(`(answer:Text:Answer)<-[:UP_VOTE]-(user:User {userId: '1'})`)
            .return(`user`).end().send();
        resp.length.should.equals(1);
    });
});
