'use strict';

var users = require('../../util/user');
var db = require('../../util/db');
var requestHandler = require('../../util/request');
var should = require('chai').should();

describe('Integration Tests for searching people or pages', function () {

    var requestAgent;

    beforeEach(function () {

        var commands = [];
        return db.clearDatabase().then(function () {
            commands.push(db.cypher().create("(:User {email: 'user@irgendwo.ch', password: '$2a$10$JlKlyw9RSpt3.nt78L6VCe0Kw5KW4SPRaCGSPMmpW821opXpMgKAm', name: 'user Meier', surname: 'Meier', forename:'user', userId: '1'})").end().getCommand());
            commands.push(db.cypher().create("(:User {name: 'user Meier2', forename: 'user2', surname: 'Meier2', userId: '2'})").end().getCommand());
            commands.push(db.cypher().create("(:User {name: 'tuser Meier3', forename: 'ruser', surname: 'Meier3', userId: '3'})").end().getCommand());
            commands.push(db.cypher().create("(:User {name: 'luser tMeier4', forename: 'luser', surname: 'tMeier4', userId: '4'})").end().getCommand());
            commands.push(db.cypher().create("(:User {name: 'user uMeier5', forename: 'user', surname: 'uMeier5', userId: '5'})").end().getCommand());
            commands.push(db.cypher().create("(:User {name: 'user sMeier6', forename: 'user', surname: 'sMeier6', userId: '6'})").end().getCommand());

            //Set Privacy
            commands.push(db.cypher().match("(u:User)")
                .create("(u)-[:HAS_PRIVACY_NO_CONTACT]->(:Privacy {profile: false, image: false})").end({}).getCommand());
            commands.push(db.cypher().match("(u:User)").where("u.userId IN ['1']")
                .create("(u)-[:HAS_PRIVACY {type: 'Freund'}]->(:Privacy {profile: true, image: true})").end().getCommand());

            //Set Contact Relationships
            commands.push(db.cypher().match("(u:User {userId: '1'}), (u2:User {userId: '5'})")
                .create("(u)-[:IS_CONTACT {type: 'Freund', contactAdded: '500'}]->(u2)").end().getCommand());
            commands.push(db.cypher().match("(u:User {userId: '1'}), (u2:User {userId: '3'})")
                .create("(u)-[:IS_CONTACT {type: 'Freund', contactAdded: '501'}]->(u2)").end().getCommand());

            commands.push(db.cypher().create("(:Page {title: 'book written by user', label: 'Book', description: 'bookPage1', language: 'de', created: 501, pageId: '0'," +
                "author: 'Hans Muster', publishDate: 1000, category: {category}})").end({category: ['health', 'personalDevelopment']}).getCommand());
            commands.push(db.cypher().create("(:Page {title: 'book written by Meier', label: 'Book', description: 'bookPage2', language: 'de', created: 502, pageId: '1'," +
                "author: 'Hans Muster', publishDate: 1000, category: {category}})").end({category: ['health', 'personalDevelopment']}).getCommand());
            commands.push(db.cypher().create("(:Page {title: 'y written by user', label: 'Book', description: 'bookPage3', language: 'de', created: 500, pageId: '2'," +
                "author: 'Hans Muster', publishDate: 1000, category: {category}})").end({category: ['health', 'personalDevelopment']}).getCommand());
            commands.push(db.cypher().create("(:Page {title: 'youtube movie by user', label: 'Youtube', description: 'youtube1', language: 'de', created: 503, pageId: '3'," +
                "author: 'Hans Muster', publishDate: 1000, link: 'www.test.ch', category: {category}})").end({category: ['health', 'personalDevelopment']}).getCommand());
            commands.push(db.cypher().create("(:Page {title: 'youtube movie by Meier', label: 'Youtube', description: 'youtube2', language: 'de', created: 504, pageId: '4'," +
                "author: 'Hans Muster', publishDate: 1000, link: 'www.test2.ch', category: {category}})").end({category: ['health', 'personalDevelopment']}).getCommand());
            commands.push(db.cypher().create("(:Page {title: 'y movie by Meier', label: 'Youtube', description: 'youtube2', language: 'de', created: 499, pageId: '5'," +
                "author: 'Hans Muster', publishDate: 1000, link: 'www.test3.ch', category: {category}})").end({category: ['health', 'personalDevelopment']}).getCommand());

            //Set Recommendations
            commands.push(db.cypher().match("(a:Page {pageId: '2'}), (b:User {userId: '1'})")
                .create("(b)-[:RECOMMENDS]->(:Recommendation {created: 507, recommendationId: '1', rating: 4})-[:RECOMMENDS]->(a)").end().getCommand());
            return db.cypher().match("(a:Page {pageId: '5'}), (b:User {userId: '1'})")
                .create("(b)-[:RECOMMENDS]->(:Recommendation {created: 508, recommendationId: '2', rating: 3})-[:RECOMMENDS]->(a)").end().send(commands);
        });
    });

    afterEach(function () {
        return requestHandler.logout();
    });

    it('Search with forename books and people - Return 200', function () {
        return requestHandler.login(users.validUser).then(function (agent) {
            requestAgent = agent;
            return requestHandler.getWithData('/api/user/home/search', {
                search: 'user',
                maxItems: 10,
                isSuggestion: true
            }, requestAgent);
        }).then(function (res) {
            res.status.should.equal(200);
            res.body.length.should.equal(6);
            res.body[0].name.should.equal("user uMeier5");
            res.body[0].userId.should.equal("5");
            res.body[0].type.should.equal('Freund');
            res.body[0].profileUrl.should.equal('profileImage/default/thumbnail.jpg');

            res.body[1].name.should.equal("user Meier2");
            res.body[1].userId.should.equal("2");
            should.not.exist(res.body[1].type);
            res.body[1].profileUrl.should.equal('profileImage/default/thumbnail.jpg');

            res.body[2].name.should.equal("user sMeier6");
            res.body[2].userId.should.equal("6");
            should.not.exist(res.body[1].type);
            res.body[2].profileUrl.should.equal('profileImage/default/thumbnail.jpg');
            
            res.body[3].title.should.equal("y written by user");
            res.body[3].pageId.should.equal("2");
            res.body[3].label.should.equal("Book");

            res.body[4].title.should.equal("book written by user");
            res.body[4].pageId.should.equal("0");
            res.body[4].label.should.equal("Book");

            res.body[5].title.should.equal("youtube movie by user");
            res.body[5].pageId.should.equal("3");
            res.body[5].label.should.equal("Youtube");
        });
    });

});
