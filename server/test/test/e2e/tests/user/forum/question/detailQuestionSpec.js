'use strict';

var users = require('../../../util/user');
var db = require('../../../util/db');
var requestHandler = require('../../../util/request');
var moment = require('moment');
var should = require('chai').should();

describe('Integration Tests for getting the details of a forum question', function () {

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
                .create("(u)-[:IS_ADMIN]->(:ForumSolution:ForumAnswer {answerId: '1', description: 'forumSolution1', created: 501})<-[:IS_ANSWER]-(forumQuestion)")
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
                .create("(u)-[:IS_ADMIN]->(:ForumExplanation:ForumAnswer {answerId: '3', description: 'forumExplanation1', created: 503})<-[:IS_ANSWER]-(forumQuestion)")
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

    it('Getting the detail of a forum question - Return 200', function () {

        return requestHandler.login(users.validUser).then(function (agent) {
            requestAgent = agent;
            return requestHandler.getWithData('/api/user/forum/question/detail', {
                questionId: '0'
            }, requestAgent);
        }).then(function (res) {
            res.status.should.equal(200);
            
            res.body.question.description.should.equals('forumQuestion');
            res.body.question.language.should.equals('de');
            res.body.question.category.length.should.equals(1);
            res.body.question.category[0].should.equals('environmental');

            res.body.solution.length.should.equals(2);
            res.body.solution[0].answerId.should.equals('0');
            res.body.solution[0].description.should.equals('forumSolution');
            res.body.solution[0].created.should.equals(500);
            res.body.solution[0].positiveRating.should.equals(3);
            res.body.solution[0].page.pageId.should.equals('1');
            res.body.solution[0].page.title.should.equals('page2Title');
            res.body.solution[0].page.label.should.equals('Youtube');
            res.body.solution[0].page.link.should.equals('https://www.youtube.com/embed/Test');
            res.body.solution[0].page.description.should.equals('page2');

            res.body.solution[1].answerId.should.equals('1');
            res.body.solution[1].description.should.equals('forumSolution1');
            res.body.solution[1].created.should.equals(501);
            res.body.solution[1].positiveRating.should.equals(2);
            should.not.exist(res.body.solution[1].page);

            res.body.explanation.length.should.equals(2);
            res.body.explanation[0].answerId.should.equals('2');
            res.body.explanation[0].description.should.equals('forumExplanation');
            res.body.explanation[0].created.should.equals(502);
            res.body.explanation[0].positiveRating.should.equals(2);
            res.body.explanation[0].page.pageId.should.equals('0');
            res.body.explanation[0].page.title.should.equals('page1Title');
            res.body.explanation[0].page.label.should.equals('Book');
            res.body.explanation[0].page.description.should.equals('page1');

            res.body.explanation[1].answerId.should.equals('3');
            res.body.explanation[1].description.should.equals('forumExplanation1');
            res.body.explanation[1].created.should.equals(503);
            res.body.explanation[1].positiveRating.should.equals(1);
        });
    });

});
