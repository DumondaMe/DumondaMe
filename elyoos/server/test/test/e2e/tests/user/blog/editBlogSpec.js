'use strict';

let users = require('elyoos-server-test-util').user;
let db = require('elyoos-server-test-util').db;
let dbDsl = require('elyoos-server-test-util').dbDSL;
let requestHandler = require('elyoos-server-test-util').requestHandler;
let sinon = require('sinon');
let moment = require('moment');
let stubCDN = require('elyoos-server-test-util').stubCDN();

describe('Integration Tests for edit a blog', function () {

    beforeEach(function () {

        stubCDN.uploadFile.reset();
        return dbDsl.init(2).then(function () {

            dbDsl.createPrivacyNoContact(null, {profile: true, image: true, profileData: true, contacts: true, pinwall: true});

            dbDsl.createBlog('0', {
                blogWriterUserId: '1',
                language: ['en'],
                topic: ['health', 'personalDevelopment'],
                created: 501,
                pictureHeight: 400,
                title: 'blogTitle1'
            });
            dbDsl.createBlog('1', {
                blogWriterUserId: '2',
                language: ['en'],
                topic: ['social'],
                created: 502,
                pictureHeight: 401,
                title: 'blogTitle2'
            });

        });
    });

    afterEach(function () {
        return requestHandler.logout();
    });

    it('User edit a blog', function () {
        let startTime = Math.floor(moment.utc().valueOf() / 1000), modified;

        return dbDsl.sendToDb().then(function () {
            return requestHandler.login(users.validUser);
        }).then(function (agent) {
            return requestHandler.post('/api/user/blog', {
                editBlog: {
                    pageId: '0',
                    text: 'testBlog1',
                    topic: ['environmental', 'spiritual'],
                    language: 'fr'
                }
            }, agent, './test/test/e2e/tests/user/blog/testLandscape.jpg');
        }).then(function (res) {
            res.status.should.equal(200);
            modified = res.body.modified;
            res.body.modified.should.least(startTime);
            stubCDN.uploadFile.calledWith(sinon.match.any, "blog/0/preview.jpg").should.be.true;
            stubCDN.uploadFile.calledWith(sinon.match.any, "blog/0/normal.jpg").should.be.true;
            return db.cypher().match("(blog:Blog:PinwallElement {pageId: '0'})")
                .return('blog').end().send();
        }).then(function (blog) {
            blog.length.should.equals(1);
            blog[0].blog.title.should.equals('blogTitle1');
            blog[0].blog.label.should.equals('Blog');
            blog[0].blog.text.should.equals('testBlog1');
            blog[0].blog.modified.should.equals(modified);
            blog[0].blog.topic.length.should.equals(2);
            blog[0].blog.topic[0].should.equals('environmental');
            blog[0].blog.topic[1].should.equals('spiritual');
            blog[0].blog.language.length.should.equals(1);
            blog[0].blog.language[0].should.equals('fr');
        });
    });

    it('Editing a blog of another user not allowed (400)', function () {
        return dbDsl.sendToDb().then(function () {
            return requestHandler.login(users.validUser);
        }).then(function (agent) {
            return requestHandler.post('/api/user/blog', {
                editBlog: {
                    pageId: '1',
                    text: 'testBlog1',
                    topic: ['environmental', 'spiritual'],
                    language: 'fr'
                }
            }, agent, './test/test/e2e/tests/user/blog/testLandscape.jpg');
        }).then(function (res) {
            res.status.should.equal(400);
            stubCDN.uploadFile.calledWith(sinon.match.any, "blog/1/preview.jpg").should.be.false;
            stubCDN.uploadFile.calledWith(sinon.match.any, "blog/1/normal.jpg").should.be.false;
            return db.cypher().match("(blog:Blog:PinwallElement {pageId: '1'})")
                .return('blog').end().send();
        }).then(function (blog) {
            blog.length.should.equals(1);
            blog[0].blog.title.should.equals('blogTitle2');
            blog[0].blog.label.should.equals('Blog');
            blog[0].blog.text.should.equals('blog1Text');
            blog[0].blog.topic.length.should.equals(1);
            blog[0].blog.topic[0].should.equals('social');
            blog[0].blog.language.length.should.equals(1);
            blog[0].blog.language[0].should.equals('en');
        });
    });
});
