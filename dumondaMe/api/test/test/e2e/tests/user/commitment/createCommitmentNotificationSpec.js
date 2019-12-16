'use strict';

let users = require('dumonda-me-server-test-util').user;
let db = require('dumonda-me-server-test-util').db;
let dbDsl = require('dumonda-me-server-test-util').dbDSL;
let requestHandler = require('dumonda-me-server-test-util').requestHandler;
let should = require('chai').should();
let moment = require('moment');

describe('When a new commitment is created, create notifications should be created', function () {

    let startTime;

    beforeEach(async function () {
        await dbDsl.init(5);
        startTime = Math.floor(moment.utc().valueOf() / 1000);
        dbDsl.createMainTopic({topicId: 'topic1', descriptionDe: 'topic1De', descriptionEn: 'topic1En'});
        dbDsl.createRegion('international', {de: 'InternationalDe', en: 'InternationalEn'});
        dbDsl.createRegion('region-1', {parentRegionId: 'international', de: 'Region1De', en: 'Region1En'});

        dbDsl.createCommitment('1', {
            adminId: '1', topics: ['topic1'], language: 'de', created: 700,
            website: 'https://www.example.org/', regions: ['region-1']
        });
    });

    afterEach(function () {
        return requestHandler.logout();
    });

    it('All users of the platform are notified', async function () {
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.post('/api/user/commitment', {
            title: 'Commitment Example', description: 'description',
            regions: ['region-1'], topics: ['topic1'], lang: 'de'
        });
        res.status.should.equal(200);

        let notification = await db.cypher().match(`(notifiedUser:User)<-[:NOTIFIED]-
                    (notification:Notification:NoEmail:Unread {type: 'newCommitment'})
                    -[relNot:ORIGINATOR_OF_NOTIFICATION]->(user:User {userId: '1'})`)
            .match(`(notification)-[:NOTIFICATION]->(c:Commitment {commitmentId: {commitmentId}})`)
            .return('notification, notifiedUser')
            .end({commitmentId: res.body.commitmentId}).send();
        notification.length.should.equals(4);
        for (let index = 0; index < 4; index++) {
            should.exist(notification[index].notification.notificationId);
            notification[index].notification.created.should.least(startTime);
            notification[index].notifiedUser.userId.should.not.equals('1');

        }
    });
});
