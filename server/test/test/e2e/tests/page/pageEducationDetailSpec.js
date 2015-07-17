'use strict';

var users = require('../util/user');
var db = require('../util/db');
var requestHandler = require('../util/request');
var moment = require('moment');
var should = require('chai').should();

describe('Integration Tests for getting education page details', function () {

    var requestAgent, startTime;

    beforeEach(function () {

        var commands = [];
        startTime = Math.floor(moment.utc().valueOf() / 1000) + 100; // Add a delay
        return db.clearDatabase().then(function () {
            commands.push(db.cypher().create("(:User {email: 'user@irgendwo.ch', password: '$2a$10$JlKlyw9RSpt3.nt78L6VCe0Kw5KW4SPRaCGSPMmpW821opXpMgKAm', name: 'user Meier', surname: 'Meier', forename:'user', userId: '1'})").end().getCommand());
            commands.push(db.cypher().create("(:User {name: 'user Meier2', userId: '2'})").end().getCommand());
            commands.push(db.cypher().create("(:User {name: 'user Meier3', userId: '3'})").end().getCommand());
            commands.push(db.cypher().create("(:Page {title: 'educationPage1Title', label: 'Education', description: 'educationPage1', language: 'de', created: 501, pageId: '0'," +
                "website: 'wwww.website1.com', street:'Strasse 2', place:'Bern', postalCode:'3006', country:'ch'})").end().getCommand());
            commands.push(db.cypher().create("(:Page {title: 'coursePage1Title', label: 'Course', description: 'coursePage1', language: 'de', created: 501, pageId: '1'," +
                "website: 'wwww.website2.com'})").end().getCommand());
            commands.push(db.cypher().create("(:Activity { website: 'wwww.website3.com', startTime: " + startTime + ", endTime: " + (startTime + 3) + "})").end().getCommand());
            commands.push(db.cypher().match("(p:Activity { website: 'wwww.website3.com'})").setArray("p.times", [startTime, startTime + 1, startTime + 2, startTime + 3]).end().getCommand());
            commands.push(db.cypher().create("(:Activity { website: 'wwww.website4.com', startTime: " + (startTime + 4) + ", endTime: " + (startTime + 7) + "})").end().getCommand());
            commands.push(db.cypher().match("(p:Activity { website: 'wwww.website4.com'})").setArray("p.times", [startTime + 4, startTime + 5, startTime + 6, startTime + 7]).end().getCommand());
            startTime -= 100;
            commands.push(db.cypher().create("(:Activity { website: 'wwww.website5.com', startTime: " + (startTime - 4) + ", endTime: " + (startTime - 1) + "})").end().getCommand());
            commands.push(db.cypher().match("(p:Activity { website: 'wwww.website5.com'})").setArray("p.times", [startTime - 4, startTime - 3, startTime - 2, startTime - 1]).end().getCommand());
            commands.push(db.cypher().create("(:Page {title: 'coursePage2Title', label: 'Course', description: 'coursePage2', language: 'de', created: 501, pageId: '2'," +
                "website: 'wwww.website6.com', street:'Strasse 1', place:'Winkel', postalCode:'8185', country:'ch'})").end().getCommand());
            return db.cypher().create("(:Page {title: 'coursePage3Title', label: 'Course', description: 'coursePage3', language: 'de', created: 501, pageId: '3'," +
                "website: 'wwww.website7.com', street:'Strasse 2', place:'Winkel2', postalCode:'8186', country:'de'})").end().send(commands);

        });
    });

    afterEach(function () {
        return requestHandler.logout();
    });

    it('Getting the detail of the page for a education', function () {

        var commands = [];

        commands.push(db.cypher().match("(u:User {userId: '1'})")
            .create("(u)-[:HAS_PRIVACY_NO_CONTACT]->(:Privacy {profile: false, image: false, profileData: true, contacts: true}), " +
            "(u)-[:HAS_PRIVACY {type: 'Freund'}]->(:Privacy {profile: true, image: true})").end().getCommand());
        commands.push(db.cypher().match("(u:User {userId: '2'})")
            .create("(u)-[:HAS_PRIVACY_NO_CONTACT]->(:Privacy {profile: false, image: true, profileData: true, contacts: true})")
            .end().getCommand());
        commands.push(db.cypher().match("(a:User {userId: '2'}), (b:User {userId: '1'})")
            .create("(b)-[:IS_CONTACT {type: 'Freund'}]->(a)")
            .end().getCommand());
        commands.push(db.cypher().match("(a:User {userId: '3'}), (b:User {userId: '1'})")
            .create("(b)-[:IS_CONTACT {type: 'Freund'}]->(a)")
            .end().getCommand());

        commands.push(db.cypher().match("(a:Page {pageId: '0'}), (b:User {userId: '1'})")
            .create("(b)-[:IS_ADMIN]->(a)")
            .end().getCommand());

        commands.push(db.cypher().match("(a:Page {pageId: '0'}), (b:Page {pageId: '1'})")
            .create("(a)-[:HAS]->(b)")
            .end().getCommand());
        commands.push(db.cypher().match("(a:Page {pageId: '0'}), (b:Page {pageId: '2'})")
            .create("(a)-[:HAS]->(b)")
            .end().getCommand());
        commands.push(db.cypher().match("(a:Page {pageId: '0'}), (b:Page {pageId: '3'})")
            .create("(a)-[:HAS]->(b)")
            .end().getCommand());
        commands.push(db.cypher().match("(a:Page {pageId: '2'}), (b:Activity {website: 'wwww.website3.com'})")
            .create("(a)-[:HAS]->(b)")
            .end().getCommand());
        commands.push(db.cypher().match("(a:Page {pageId: '2'}), (b:Activity {website: 'wwww.website4.com'})")
            .create("(a)-[:HAS]->(b)")
            .end().getCommand());
        commands.push(db.cypher().match("(a:Page {pageId: '2'}), (b:Activity {website: 'wwww.website5.com'})")
            .create("(a)-[:HAS]->(b)")
            .end().getCommand());
        commands.push(db.cypher().match("(a:Page {pageId: '3'}), (b:Activity {website: 'wwww.website5.com'})")
            .create("(a)-[:HAS]->(b)")
            .end().getCommand());

        //Recommendation of the first Course by contacts
        commands.push(db.cypher().match("(a:Page {pageId: '2'}), (b:User {userId: '2'})")
            .create("(b)-[:RECOMMENDS]->(:Recommendation {created: 500, rating: 2, recommendationId: '0'})-[:RECOMMENDS]->(a)")
            .end().getCommand());
        commands.push(db.cypher().match("(a:Page {pageId: '2'}), (b:User {userId: '3'})")
            .create("(b)-[:RECOMMENDS]->(:Recommendation {created: 500, rating: 4, recommendationId: '1'})-[:RECOMMENDS]->(a)")
            .end().getCommand());

        return db.cypher().match("(a:Page {pageId: '0'}), (b:User {userId: '2'})")
            .create("(b)-[:IS_ADMIN]->(a)")
            .end().send(commands)
            .then(function () {
                return requestHandler.login(users.validUser);
            }).
            then(function (agent) {
                requestAgent = agent;
                return requestHandler.getWithData('/api/page/detail', {
                    pageId: '0',
                    label: 'Education'
                }, requestAgent);
            }).then(function (res) {
                res.status.should.equal(200);
                res.body.page.title.should.equals('educationPage1Title');
                res.body.page.description.should.equals('educationPage1');
                res.body.page.language.should.equals('de');
                res.body.page.created.should.equals(501);
                res.body.page.website.should.equals('wwww.website1.com');
                res.body.page.street.should.equals('Strasse 2');
                res.body.page.place.should.equals('Bern');
                res.body.page.postalCode.should.equals('3006');
                res.body.page.country.should.equals('ch');
                res.body.page.titleUrl.should.equals('pages/0/pageTitlePicture.jpg');

                res.body.page.course.length.should.equals(3);
                res.body.page.course[0].title.should.equals('coursePage1Title');
                res.body.page.course[0].language.should.equals('de');
                res.body.page.course[0].pageId.should.equals('1');
                res.body.page.course[0].url.should.equals('pages/1/pagePreview.jpg');
                should.not.exist(res.body.page.course[0].recommendation);
                res.body.page.course[1].title.should.equals('coursePage2Title');
                res.body.page.course[1].language.should.equals('de');
                res.body.page.course[1].pageId.should.equals('2');
                res.body.page.course[1].url.should.equals('pages/2/pagePreview.jpg');
                res.body.page.course[1].recommendation.contact.rating.should.equals(3);
                res.body.page.course[2].title.should.equals('coursePage3Title');
                res.body.page.course[2].language.should.equals('de');
                res.body.page.course[2].pageId.should.equals('3');
                res.body.page.course[2].url.should.equals('pages/3/pagePreview.jpg');
                should.not.exist(res.body.page.course[2].recommendation);

                res.body.page.activities.length.should.equals(2);
                startTime += 100;
                res.body.page.activities[0].startTime.should.equals(startTime);
                res.body.page.activities[0].endTime.should.equals(startTime + 3);
                res.body.page.activities[0].pageId.should.equals("2");
                res.body.page.activities[0].label.should.equals("Course");
                res.body.page.activities[0].title.should.equals('coursePage2Title');
                res.body.page.activities[0].times.length.should.equals(4);
                res.body.page.activities[0].times[0].should.equals(startTime);
                res.body.page.activities[0].times[1].should.equals(startTime + 1);
                res.body.page.activities[0].times[2].should.equals(startTime + 2);
                res.body.page.activities[0].times[3].should.equals(startTime + 3);
                res.body.page.activities[1].startTime.should.equals(startTime + 4);
                res.body.page.activities[1].endTime.should.equals(startTime + 7);
                res.body.page.activities[1].pageId.should.equals("2");
                res.body.page.activities[1].label.should.equals("Course");
                res.body.page.activities[1].title.should.equals('coursePage2Title');
                res.body.page.activities[1].times.length.should.equals(4);
                res.body.page.activities[1].times[0].should.equals(startTime + 4);
                res.body.page.activities[1].times[1].should.equals(startTime + 5);
                res.body.page.activities[1].times[2].should.equals(startTime + 6);
                res.body.page.activities[1].times[3].should.equals(startTime + 7);

                res.body.administrators.list.length.should.equals(2);
                res.body.administrators.list[0].name.should.equals('user Meier');
                res.body.administrators.list[0].userId.should.equals('1');
                res.body.administrators.list[0].profileUrl.should.equals('profileImage/1/profilePreview.jpg');
                res.body.administrators.list[1].name.should.equals('user Meier2');
                res.body.administrators.list[1].userId.should.equals('2');
                res.body.administrators.list[1].profileUrl.should.equals('profileImage/default/profilePreview.jpg');
                res.body.administrators.isAdmin.should.be.true;
            });
    });

});
