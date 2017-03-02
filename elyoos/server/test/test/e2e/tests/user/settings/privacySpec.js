'use strict';

let libUser = require('elyoos-server-lib').user();
let requestHandler = require('elyoos-server-test-util').requestHandler;
let users = require('elyoos-server-test-util').user;
let db = require('elyoos-server-test-util').db;
let dbDsl = require('elyoos-server-test-util').dbDSL;
let moment = require('moment');
let should = require('chai').should();

describe('Integration Tests for the privacy settings', function () {

    beforeEach(function () {

        libUser.removeFromCache('user@irgendwo.ch');
        return dbDsl.init(4).then(function () {
            let startTime = Math.floor(moment.utc().valueOf() / 1000);
            dbDsl.createPrivacyNoContact(['1'], {profile: false, image: false, profileData: false, contacts: false, pinwall: false});
            dbDsl.createPrivacy(['1'], 'Freund', {profile: true, image: true, profileData: true, contacts: false, pinwall: true});
            dbDsl.createPrivacy(['1'], 'Familie', {profile: true, image: true, profileData: true, contacts: true, pinwall: true});
            dbDsl.createPrivacy(['1'], 'Bekannter', {profile: true, image: true, profileData: false, contacts: false, pinwall: false});

            dbDsl.createBlog('1', {blogWriterUserId: '1', language: ['de'], topic: ['health'], visible: ['Freund', 'Familie'], created: 450});
            dbDsl.createBlog('2', {blogWriterUserId: '1', language: ['de'], topic: ['health'], visible: ['Familie'], created: 450});
            dbDsl.createBlog('3', {blogWriterUserId: '1', language: ['de'], topic: ['health'], created: 450});

            dbDsl.createContactConnection('1', '2', 'Freund', startTime - 86401);
            dbDsl.createContactConnection('1', '3', 'Freund', startTime - 86401);
            dbDsl.createContactConnection('1', '4', 'Familie', startTime - 86401);
            return dbDsl.sendToDb();
        });
    });

    afterEach(function () {
        return requestHandler.logout();
    });

    it('Get the privacy settings of the user- Return a 200', function () {
        return requestHandler.login(users.validUser).then(function (agent) {
            return requestHandler.get('/api/user/settings/privacy', agent);
        }).then(function (res) {
            res.status.should.equal(200);
            res.body.normal.length.should.equal(3);
            res.body.normal[0].type.should.equal('Bekannter');
            res.body.normal[0].profileVisible.should.be.true;
            res.body.normal[0].profileDataVisible.should.be.false;
            res.body.normal[0].imageVisible.should.be.true;
            res.body.normal[0].contactsVisible.should.be.false;
            res.body.normal[0].pinwallVisible.should.be.false;
            res.body.normal[1].type.should.equal('Familie');
            res.body.normal[1].profileVisible.should.be.true;
            res.body.normal[1].profileDataVisible.should.be.true;
            res.body.normal[1].imageVisible.should.be.true;
            res.body.normal[1].contactsVisible.should.be.true;
            res.body.normal[1].pinwallVisible.should.be.true;
            res.body.normal[2].type.should.equal('Freund');
            res.body.normal[2].profileVisible.should.be.true;
            res.body.normal[2].profileDataVisible.should.be.true;
            res.body.normal[2].imageVisible.should.be.true;
            res.body.normal[2].contactsVisible.should.be.false;
            res.body.normal[2].pinwallVisible.should.be.true;


            res.body.noContact.profileVisible.should.be.false;
            res.body.noContact.profileDataVisible.should.be.false;
            res.body.noContact.imageVisible.should.be.false;
            res.body.noContact.contactsVisible.should.be.false;
            res.body.noContact.pinwallVisible.should.be.false;
        });
    });

    it('Change the privacy settings for a contact type- Return a 200', function () {
        return requestHandler.login(users.validUser).then(function (agent) {
            let data = {
                changePrivacySetting: {
                    privacySettings: {
                        profileVisible: false,
                        profileDataVisible: false,
                        imageVisible: false,
                        contactsVisible: false,
                        pinwallVisible:false
                    },
                    privacyDescription: 'Familie'
                }
            };
            return requestHandler.post('/api/user/settings/privacy', data, agent);
        }).then(function (res) {
            res.status.should.equal(200);
            return db.cypher().match("(:User {userId: '1'})-[:HAS_PRIVACY {type:'Familie'}]->(privacy:Privacy)")
                .return('privacy as privacy')
                .end().send();
        }).then(function (privacy) {
            privacy.length.should.equals(1);
            privacy[0].privacy.profile.should.be.false;
            privacy[0].privacy.profileData.should.be.false;
            privacy[0].privacy.contacts.should.be.false;
            privacy[0].privacy.image.should.be.false;
            privacy[0].privacy.pinwall.should.be.false;
        });
    });

    it('Change the privacy settings for a non existing type- Return a 400', function () {
        return requestHandler.login(users.validUser).then(function (agent) {
            let data = {
                changePrivacySetting: {
                    privacySettings: {
                        profileVisible: false,
                        profileDataVisible: false,
                        imageVisible: false,
                        contactsVisible: false,
                        pinwallVisible:false
                    },
                    privacyDescription: 'Famili'
                }
            };
            return requestHandler.post('/api/user/settings/privacy', data, agent);
        }).then(function (res) {
            res.status.should.equal(400);
        });
    });

    it('Change the privacy settings for a all non contact types- Return a 200', function () {
        return requestHandler.login(users.validUser).then(function (agent) {
            let data = {
                changePrivacyNoContactSetting: {
                    privacySettings: {
                        profileVisible: true,
                        profileDataVisible: true,
                        imageVisible: true,
                        contactsVisible: true,
                        pinwallVisible:true
                    }
                }
            };
            return requestHandler.post('/api/user/settings/privacy', data, agent);
        }).then(function (res) {
            res.status.should.equal(200);
            return db.cypher().match("(:User {userId: '1'})-[:HAS_PRIVACY_NO_CONTACT]->(privacy:Privacy)")
                .return('privacy as privacy')
                .end().send();
        }).then(function (privacy) {
            privacy.length.should.equals(1);
            privacy[0].privacy.profile.should.be.true;
            privacy[0].privacy.profileData.should.be.true;
            privacy[0].privacy.contacts.should.be.true;
            privacy[0].privacy.image.should.be.true;
            privacy[0].privacy.pinwall.should.be.true;
        });
    });

    it('Rename a privacy type and rename the corresponding -> (contact, blog) - Return a 200', function () {
        return requestHandler.login(users.validUser).then(function (agent) {
            let data = {
                renamePrivacy: {
                    privacyDescription: 'Freund',
                    newPrivacyDescription: 'Freund2'
                }
            };
            return requestHandler.post('/api/user/settings/privacy', data, agent);
        }).then(function (res) {
            res.status.should.equal(200);
            return db.cypher().match("(:User {userId: '1'})-[r:IS_CONTACT]->(:User)")
                .return('r.type as type, count(r.type) as count')
                .end().send();
        }).then(function (contactType) {
            contactType.length.should.equals(2);
            contactType[0].type.should.equals('Familie');
            contactType[0].count.should.equals(1);
            contactType[1].type.should.equals('Freund2');
            contactType[1].count.should.equals(2);
            return db.cypher().match("(:User {userId: '1'})-[r:HAS_PRIVACY]->(:Privacy)")
                .return('r.type as type, count(r.type) as count')
                .end().send();
        }).then(function (contactType) {
            contactType.length.should.equals(3);
            contactType[0].type.should.equals('Familie');
            contactType[0].count.should.equals(1);
            contactType[1].type.should.equals('Freund2');
            contactType[1].count.should.equals(1);
            contactType[2].type.should.equals('Bekannter');
            contactType[2].count.should.equals(1);
            return db.cypher().match("(blog:Blog {pageId: '1'})")
                .return('blog.visible AS visible')
                .end().send();
        }).then(function (blog) {
            blog.length.should.equals(1);
            blog[0].visible.length.should.equals(2);
            blog[0].visible[0].should.equals('Familie');
            blog[0].visible[1].should.equals('Freund2');
            return db.cypher().match("(blog:Blog {pageId: '2'})")
                .return('blog.visible AS visible')
                .end().send();
        }).then(function (blog) {
            blog.length.should.equals(1);
            blog[0].visible.length.should.equals(1);
            return db.cypher().match("(blog:Blog {pageId: '3'})")
                .return('blog.visible AS visible')
                .end().send();
        }).then(function (blog) {
            blog.length.should.equals(1);
            should.not.exist(blog[0].visible);
        });
    });

    it('Rename a privacy to a existing privacy shall fail- Return a 400', function () {
        return requestHandler.login(users.validUser).then(function (agent) {
            let data = {
                renamePrivacy: {
                    privacyDescription: 'Freund',
                    newPrivacyDescription: 'Bekannter'
                }
            };
            return requestHandler.post('/api/user/settings/privacy', data, agent);
        }).then(function (res) {
            res.status.should.equal(400);
            return db.cypher().match("(:User {userId: '1'})-[r:IS_CONTACT]->(:User)")
                .return('r.type as type, count(r.type) as count')
                .end().send();
        }).then(function (contactType) {
            contactType.length.should.equals(2);
            contactType[0].type.should.equals('Freund');
            contactType[0].count.should.equals(2);
            contactType[1].type.should.equals('Familie');
            contactType[1].count.should.equals(1);
            return db.cypher().match("(:User {userId: '1'})-[r:HAS_PRIVACY]->(:Privacy)")
                .return('r.type as type, count(r.type) as count')
                .end().send();
        }).then(function (contactType) {
            contactType.length.should.equals(3);
            contactType[0].type.should.equals('Freund');
            contactType[0].count.should.equals(1);
            contactType[1].type.should.equals('Familie');
            contactType[1].count.should.equals(1);
            contactType[2].type.should.equals('Bekannter');
            contactType[2].count.should.equals(1);
        });
    });

    it('Add a new privacy type - Return a 200', function () {
        return requestHandler.login(users.validUser).then(function (agent) {
            let data = {
                addNewPrivacy: {
                    privacyDescription: 'Irgendwas',
                    privacySettings: {
                        profileVisible: true,
                        profileDataVisible: true,
                        imageVisible: true,
                        contactsVisible: true,
                        pinwallVisible:true
                    }
                }
            };
            return requestHandler.post('/api/user/settings/privacy', data, agent);
        }).then(function (res) {
            res.status.should.equal(200);
            return db.cypher().match("(:User {userId: '1'})-[r:HAS_PRIVACY]->(privacy:Privacy)")
                .return('r.type as type, count(r.type) as count, privacy.profile as profile, privacy.profileData as profileData, ' +
                'privacy.contacts as contacts, privacy.image as image, privacy.pinwall as pinwall')
                .orderBy("r.type")
                .end().send();
        }).then(function (contactType) {
            contactType.length.should.equals(4);
            contactType[0].type.should.equals('Bekannter');
            contactType[0].count.should.equals(1);
            contactType[1].type.should.equals('Familie');
            contactType[1].count.should.equals(1);
            contactType[2].type.should.equals('Freund');
            contactType[2].count.should.equals(1);
            contactType[3].type.should.equals('Irgendwas');
            contactType[3].count.should.equals(1);
            contactType[3].profile.should.be.true;
            contactType[3].profileData.should.be.true;
            contactType[3].image.should.be.true;
            contactType[3].contacts.should.be.true;
            contactType[3].pinwall.should.be.true;
        });
    });

    it('Adding a new privacy type fails because privacy type exists already- Return a 200', function () {
        return requestHandler.login(users.validUser).then(function (agent) {
            let data = {
                addNewPrivacy: {
                    privacyDescription: 'Freund',
                    privacySettings: {
                        profileVisible: false,
                        profileDataVisible: false,
                        imageVisible: false,
                        contactsVisible: false,
                        pinwallVisible:false
                    }
                }
            };
            return requestHandler.post('/api/user/settings/privacy', data, agent);
        }).then(function (res) {
            res.status.should.equal(400);
            return db.cypher().match("(:User {userId: '1'})-[r:HAS_PRIVACY]->(privacy:Privacy)")
                .return('r.type as type, count(r.type) as count, privacy.profile as profile, privacy.profileData as profileData, ' +
                'privacy.contacts as contacts, privacy.image as image, privacy.pinwall as pinwall')
                .orderBy("r.type")
                .end().send();
        }).then(function (contactType) {
            contactType.length.should.equals(3);
            contactType[0].type.should.equals('Bekannter');
            contactType[0].count.should.equals(1);
            contactType[1].type.should.equals('Familie');
            contactType[1].count.should.equals(1);
            contactType[2].type.should.equals('Freund');
            contactType[2].count.should.equals(1);
            contactType[2].profile.should.be.true;
            contactType[2].profileData.should.be.true;
            contactType[2].image.should.be.true;
            contactType[2].contacts.should.be.false;
            contactType[2].pinwall.should.be.true;
        });
    });

    it('Delete a privacy setting and move the contacts to the new privacy settings- Return a 200', function () {
        return requestHandler.login(users.validUser).then(function (agent) {
            let data = {
                privacyDescription: 'Freund',
                newPrivacyDescription: 'Familie'
            };
            return requestHandler.del('/api/user/settings/privacy', data, agent);
        }).then(function (res) {
            res.status.should.equal(200);
            return db.cypher().match("(:User {userId: '1'})-[r:IS_CONTACT]->(:User)")
                .return('r.type as type, count(r.type) as count')
                .end().send();
        }).then(function (contactType) {
            contactType.length.should.equals(1);
            contactType[0].type.should.equals('Familie');
            contactType[0].count.should.equals(3);
            return db.cypher().match("(:User {userId: '1'})-[r:HAS_PRIVACY]->(:Privacy)")
                .return('r.type as type, count(r.type) as count')
                .end().send();
        }).then(function (contactType) {
            contactType.length.should.equals(2);
            contactType[0].type.should.equals('Familie');
            contactType[0].count.should.equals(1);
            contactType[1].type.should.equals('Bekannter');
            contactType[1].count.should.equals(1);
        });
    });

    it('Delete a privacy setting fails because the privacy setting to move existing contacts does not exist- Return a 400', function () {
        return requestHandler.login(users.validUser).then(function (agent) {
            let data = {
                privacyDescription: 'Freund',
                newPrivacyDescription: 'Famili'
            };
            return requestHandler.del('/api/user/settings/privacy', data, agent);
        }).then(function (res) {
            res.status.should.equal(400);
            return db.cypher().match("(:User {userId: '1'})-[r:IS_CONTACT]->(:User)")
                .return('r.type as type, count(r.type) as count')
                .end().send();
        }).then(function (contactType) {
            contactType.length.should.equals(2);
            contactType[0].type.should.equals('Freund');
            contactType[0].count.should.equals(2);
            contactType[1].type.should.equals('Familie');
            contactType[1].count.should.equals(1);
            return db.cypher().match("(:User {userId: '1'})-[r:HAS_PRIVACY]->(:Privacy)")
                .return('r.type as type, count(r.type) as count')
                .end().send();
        }).then(function (contactType) {
            contactType.length.should.equals(3);
            contactType[0].type.should.equals('Freund');
            contactType[0].count.should.equals(1);
            contactType[1].type.should.equals('Familie');
            contactType[1].count.should.equals(1);
            contactType[2].type.should.equals('Bekannter');
            contactType[2].count.should.equals(1);
        });
    });
});
