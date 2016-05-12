'use strict';

var users = require('../../../util/user');
var db = require('../../../util/db');
var requestHandler = require('../../../util/request');
var moment = require('moment');

describe('Integration Tests for getting the most popular questions in the forum', function () {

    var requestAgent, startTime;

    var createQuestion = function (question, solutions, explanations) {
        var commands = [], i;

        commands.push(db.cypher().match("(u:User {userId: '1'})")
            .create("(u)-[:IS_ADMIN]->(:ForumQuestion {questionId: {questionId}, description: {description}, category: {category}, language: 'de'})")
            .end({category: question.category, questionId: question.questionId, description: question.description}).getCommand());

        for (i = 0; i < solutions.numberOf; i++) {
            commands.push(db.cypher().match("(u:User {userId: '1'}), (forumQuestion:ForumQuestion {questionId: {questionId}})")
                .create("(u)-[:IS_ADMIN]->(:ForumSolution:ForumAnswer {answerId: {answerId}, description: 'forumSolution" + question.questionId + i + "', created: {created}})<-[:IS_ANSWER]-(forumQuestion)")
                .end({questionId: question.questionId, answerId: question.questionId + i, created: 500 + i}).getCommand());
            if (solutions.ratings.length > i) {
                commands.push(db.cypher().match("(u:User), (forumSolution:ForumSolution {answerId: {answerId}})")
                    .where("u.userId IN {userIds}")
                    .create("(u)-[:RATE_POSITIVE]->(forumSolution)")
                    .end({answerId: question.questionId + i, userIds: solutions.ratings[i]}).getCommand());
            }
        }

        for (i = 0; i < explanations.numberOf; i++) {
            commands.push(db.cypher().match("(u:User {userId: '1'}), (forumQuestion:ForumQuestion {questionId: {questionId}})")
                .create("(u)-[:IS_ADMIN]->(:ForumExplanation:ForumAnswer {answerId: {answerId}, description: 'forumSolution" + question.questionId + i + "', created: {created}})<-[:IS_ANSWER]-(forumQuestion)")
                .end({questionId: question.questionId, answerId: question.questionId + i, created: 500 + i}).getCommand());
            if (explanations.ratings.length > i) {
                commands.push(db.cypher().match("(u:User), (forumExplanation:ForumExplanation {answerId: {answerId}})")
                    .where("u.userId IN {userIds}")
                    .create("(u)-[:RATE_POSITIVE]->(forumExplanation)")
                    .end({answerId: question.questionId + i, userIds: explanations.ratings[i]}).getCommand());
            }
        }

        return commands;
    };

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

            commands = commands.concat(createQuestion({category: ['spiritual'], questionId: '0', description: 'question1'},
                {numberOf: 3, ratings: [['1', '2'], ['2', '4']]}, {numberOf: 2, ratings: [['1', '2']]}));
            commands = commands.concat(createQuestion({category: ['environment'], questionId: '1', description: 'question2'},
                {numberOf: 2, ratings: [['1', '3'], ['4']]}, {numberOf: 0, ratings: []}));
            commands = commands.concat(createQuestion({category: ['health'], questionId: '2', description: 'question3'},
                {numberOf: 0, ratings: []}, {numberOf: 1, ratings: [['2', '3']]}));

            return db.cypher().create("(:Page {title: 'page1Title', label: 'Book', description: 'page1', modified: 5090, pageId: '0'})").end().send(commands);
        });
    });

    afterEach(function () {
        return requestHandler.logout();
    });

    it('Getting the most popular questions over all - Return 200', function () {

        return requestHandler.login(users.validUser).then(function (agent) {
            requestAgent = agent;
            return requestHandler.getWithData('/api/user/forum/question/popular', {
                maxItems: 10,
                skip: 0
            }, requestAgent);
        }).then(function (res) {
            res.status.should.equal(200);

            res.body.question.length.should.equals(3);

            res.body.question[0].questionId.should.equals('0');
            res.body.question[0].activityRating.should.equals(6);
            res.body.question[0].description.should.equals('question1');
            res.body.question[0].category.length.should.equals(1);
            res.body.question[0].category[0].should.equals('spiritual');

            res.body.question[1].questionId.should.equals('1');
            res.body.question[1].activityRating.should.equals(3);
            res.body.question[1].description.should.equals('question2');
            res.body.question[1].category.length.should.equals(1);
            res.body.question[1].category[0].should.equals('environment');

            res.body.question[2].questionId.should.equals('2');
            res.body.question[2].activityRating.should.equals(2);
            res.body.question[2].description.should.equals('question3');
            res.body.question[2].category.length.should.equals(1);
            res.body.question[2].category[0].should.equals('health');
        });
    });

});
