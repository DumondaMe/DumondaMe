'use strict';

var users = require('../../util/user');
var db = require('../../util/db');
var requestHandler = require('../../util/request');
var moment = require('moment');
var should = require('chai').should();

describe('Integration Tests for getting the details of a forum answer', function () {

    var requestAgent, startTime;

    beforeEach(function () {
        
        startTime = Math.floor(moment.utc().valueOf() / 1000);
        return db.clearDatabase().then(function () {
            var commands = [];
            commands.push(db.cypher().create("(:User {email: 'user@irgendwo.ch', password: '$2a$10$JlKlyw9RSpt3.nt78L6VCe0Kw5KW4SPRaCGSPMmpW821opXpMgKAm', name: 'user Meier', forename: 'user', surname: 'Meier', userId: '1'})")
                .end().getCommand());
            commands.push(db.cypher().create("(:User {name: 'user Meier2', forename: 'user', surname: 'Meier2', userId: '2'})").end().getCommand());
            commands.push(db.cypher().create("(:User {name: 'user Meier3', forename: 'user', surname: 'Meier2', userId: '3'})").end().getCommand());
            commands.push(db.cypher().create("(:User {name: 'user Meier4', forename: 'user', surname: 'Meier2', userId: '4'})").end().getCommand());

            commands.push(db.cypher().create("(:Page {title: 'page1Title', label: 'Book', description: 'page1', modified: 5090, pageId: '0'})").end().getCommand());
            commands.push(db.cypher().create("(:Page {title: 'page2Title', label: 'Youtube', link: 'https://www.youtube.com/embed/Test', description: 'page2', modified: 5091, pageId: '1'})").end().getCommand());

            commands.push(db.cypher().match("(u:User {userId: '1'})")
                .create("(u)-[:IS_ADMIN]->(:ForumQuestion {questionId: '0', description: 'forumQuestion', category: {category}, language: 'de'})")
                .end({category: ['environmental']}).getCommand());

            //Adding solutions to question
            commands.push(db.cypher().match("(u:User {userId: '1'}), (forumQuestion:ForumQuestion {questionId: '0'})")
                .create("(u)-[:IS_ADMIN]->(:ForumSolution:ForumAnswer {answerId: '0', description: 'forumSolution', created: 500})<-[:IS_ANSWER]-(forumQuestion)")
                .end().getCommand());
            commands.push(db.cypher().match("(solution:ForumSolution {answerId: '0'}), (page:Page {pageId: '1'})")
                .createUnique("(solution)-[:REFERENCE]->(page)").end().getCommand());
            commands.push(db.cypher().match("(u:User {userId: '2'}), (forumQuestion:ForumQuestion {questionId: '0'})")
                .create("(u)-[:IS_ADMIN]->(:ForumSolution:ForumAnswer {answerId: '1', title: 'titleForumSolution1', description: 'forumSolution1', created: 501})<-[:IS_ANSWER]-(forumQuestion)")
                .end().getCommand());

            //Rate solutions
            commands.push(db.cypher().match("(u:User {userId: '1'}), (forumSolution:ForumSolution {answerId: '0'})")
                .create("(u)-[:RATE_POSITIVE]->(forumSolution)").end().getCommand());
            commands.push(db.cypher().match("(u:User {userId: '2'}), (forumSolution:ForumSolution {answerId: '0'})")
                .create("(u)-[:RATE_POSITIVE]->(forumSolution)").end().getCommand());
            commands.push(db.cypher().match("(u:User {userId: '3'}), (forumSolution:ForumSolution {answerId: '0'})")
                .create("(u)-[:RATE_POSITIVE]->(forumSolution)").end().getCommand());
            commands.push(db.cypher().match("(u:User {userId: '3'}), (forumSolution:ForumSolution {answerId: '1'})")
                .create("(u)-[:RATE_POSITIVE]->(forumSolution)").end().getCommand());
            commands.push(db.cypher().match("(u:User {userId: '4'}), (forumSolution:ForumSolution {answerId: '1'})")
                .create("(u)-[:RATE_POSITIVE]->(forumSolution)").end().getCommand());

            //Adding explanation to question
            commands.push(db.cypher().match("(u:User {userId: '1'}), (forumQuestion:ForumQuestion {questionId: '0'})")
                .create("(u)-[:IS_ADMIN]->(:ForumExplanation:ForumAnswer {answerId: '2', description: 'forumExplanation', created: 502})<-[:IS_ANSWER]-(forumQuestion)")
                .end().getCommand());
            commands.push(db.cypher().match("(explanation:ForumExplanation {answerId: '2'}), (page:Page {pageId: '0'})")
                .createUnique("(explanation)-[:REFERENCE]->(page)").end().getCommand());
            commands.push(db.cypher().match("(u:User {userId: '2'}), (forumQuestion:ForumQuestion {questionId: '0'})")
                .create("(u)-[:IS_ADMIN]->(:ForumExplanation:ForumAnswer {answerId: '3', description: 'forumExplanation1', title: 'titleForumExplanation1', created: 503})<-[:IS_ANSWER]-(forumQuestion)")
                .end().getCommand());

            //Rate explanation
            commands.push(db.cypher().match("(u:User {userId: '1'}), (forumExplanation:ForumExplanation {answerId: '2'})")
                .create("(u)-[:RATE_POSITIVE]->(forumExplanation)").end().getCommand());
            commands.push(db.cypher().match("(u:User {userId: '3'}), (forumExplanation:ForumExplanation {answerId: '2'})")
                .create("(u)-[:RATE_POSITIVE]->(forumExplanation)").end().getCommand());
            return db.cypher().match("(u:User {userId: '4'}), (forumExplanation:ForumExplanation {answerId: '3'})")
                .create("(u)-[:RATE_POSITIVE]->(forumExplanation)").end().send(commands);
        });
    });

    afterEach(function () {
        return requestHandler.logout();
    });

    it('Getting the detail of a forum solution answer without referencing a page - Return 200', function () {

        return requestHandler.login(users.validUser).then(function (agent) {
            requestAgent = agent;
            return requestHandler.getWithData('/api/forum/answer/detail', {
                answerId: '1'
            }, requestAgent);
        }).then(function (res) {
            res.status.should.equals(200);

            res.body.answer.question.should.equals('forumQuestion');
            res.body.answer.type.should.equals('solution');
            res.body.answer.title.should.equals('titleForumSolution1');
            res.body.answer.description.should.equals('forumSolution1');
            res.body.answer.created.should.equals(501);
            res.body.answer.positiveRating.should.equals(2);
            res.body.answer.ratedByUser.should.equals(false);
            should.not.exist(res.body.answer.page);
        });
    });

    it('Getting the detail of a forum explanation answer without referencing a page - Return 200', function () {

        return requestHandler.login(users.validUser).then(function (agent) {
            requestAgent = agent;
            return requestHandler.getWithData('/api/forum/answer/detail', {
                answerId: '3'
            }, requestAgent);
        }).then(function (res) {
            res.status.should.equals(200);

            res.body.answer.question.should.equals('forumQuestion');
            res.body.answer.type.should.equals('explanation');
            res.body.answer.title.should.equals('titleForumExplanation1');
            res.body.answer.description.should.equals('forumExplanation1');
            res.body.answer.created.should.equals(503);
            res.body.answer.positiveRating.should.equals(1);
            res.body.answer.ratedByUser.should.equals(false);
            should.not.exist(res.body.answer.page);
        });
    });

    it('Getting the detail of a forum solution answer with referencing a page - Return 200', function () {

        return requestHandler.login(users.validUser).then(function (agent) {
            requestAgent = agent;
            return requestHandler.getWithData('/api/forum/answer/detail', {
                answerId: '0'
            }, requestAgent);
        }).then(function (res) {
            res.status.should.equals(200);

            res.body.answer.question.should.equals('forumQuestion');
            res.body.answer.type.should.equals('solution');
            res.body.answer.description.should.equals('forumSolution');
            res.body.answer.created.should.equals(500);
            res.body.answer.positiveRating.should.equals(3);
            res.body.answer.ratedByUser.should.equals(true);
            
            res.body.answer.page.pageId.should.equals('1');
            res.body.answer.page.title.should.equals('page2Title');
            res.body.answer.page.label.should.equals('Youtube');
            res.body.answer.page.link.should.equals('https://www.youtube.com/embed/Test');
        });
    });

    it('Getting the detail of a forum explanation answer with referencing a page - Return 200', function () {

        return requestHandler.login(users.validUser).then(function (agent) {
            requestAgent = agent;
            return requestHandler.getWithData('/api/forum/answer/detail', {
                answerId: '2'
            }, requestAgent);
        }).then(function (res) {
            res.status.should.equals(200);

            res.body.answer.question.should.equals('forumQuestion');
            res.body.answer.type.should.equals('explanation');
            res.body.answer.description.should.equals('forumExplanation');
            res.body.answer.created.should.equals(502);
            res.body.answer.positiveRating.should.equals(2);
            res.body.answer.ratedByUser.should.equals(true);

            res.body.answer.page.pageId.should.equals('0');
            res.body.answer.page.title.should.equals('page1Title');
            res.body.answer.page.label.should.equals('Book');
            res.body.answer.page.titleUrl.should.equals('pages/0/pageTitlePicture.jpg');
        });
    });

});
