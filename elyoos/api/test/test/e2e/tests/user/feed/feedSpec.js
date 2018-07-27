'use strict';

const dbDsl = require('elyoos-server-test-util').dbDSL;
const users = require('elyoos-server-test-util').user;
const requestHandler = require('elyoos-server-test-util').requestHandler;
const moment = require('moment');
const should = require('chai').should();

describe('Get feed of the user', function () {

    let startTime;

    beforeEach(async function () {
        await dbDsl.init(11);
        startTime = Math.floor(moment.utc().valueOf() / 1000);

        dbDsl.createRegion('region-1', {});
        dbDsl.createRegion('region-2', {});
        dbDsl.createCommitment('100', {
            adminId: '2',
            topics: ['Spiritual', 'Education'],
            language: 'de',
            created: 400,
            modified: 606,
            title: 'Test Commitment',
            website: 'https://www.example.org/',
            regions: ['region-1', 'region-2']
        });

        dbDsl.createQuestion('1', {
            creatorId: '2', question: 'Das ist eine Frage', description: 'Test elyoos.org change the world1',
            topics: ['Spiritual', 'Education'], language: 'de', created: 500, modified: 700
        });
        dbDsl.createTextAnswer('5', {
            creatorId: '6', questionId: '1', answer: 'Answer', created: 600,
        });
        dbDsl.createBookAnswer('6', {
            creatorId: '7', questionId: '1', created: 601, authors: 'Hans Wurst', googleBookId: '1234',
            hasPreviewImage: true
        });
        dbDsl.createQuestion('2', {
            creatorId: '3', question: 'Das ist eine Frage2', description: 'Test elyoos.org change the world',
            topics: ['Health'], language: 'de', created: 602,
        });
        dbDsl.createYoutubeAnswer('7', {
            creatorId: '2', questionId: '2', created: 603, idOnYoutube: '00zxopGPYW4',
            link: 'https://www.youtube.com/watch?v=00zxopGPYW4', linkEmbed: 'https://www.youtube.com/embed/00zxopGPYW4'
        });
        dbDsl.createLinkAnswer('8', {
            creatorId: '1', questionId: '2', created: 604, pageType: 'article', hasPreviewImage: true,
            link: 'https://www.example.org/blog/1224'
        });
        dbDsl.createCommitmentAnswer('9', {
            creatorId: '2', questionId: '2', commitmentId: '100', created: 605, description: 'commitmentDescription'
        });
    });

    afterEach(function () {
        return requestHandler.logout();
    });

    it('Get empty feed (no filter)', async function () {
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.get('/api/user/feed');
        res.status.should.equal(200);
        res.body.timestamp.should.least(startTime);
        res.body.totalNumberOfElements.should.equals(0);
        res.body.feed.length.should.equals(0);
    });

    it('Newly created answers to questions the user watches', async function () {
        dbDsl.watchQuestion({questionId: '2', userId: '1'});
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.get('/api/user/feed');
        res.status.should.equal(200);
        res.body.timestamp.should.least(startTime);
        res.body.totalNumberOfElements.should.equals(3);
        res.body.feed.length.should.equals(3);

        res.body.feed[0].type.should.equals('CommitmentAnswer');
        res.body.feed[0].action.should.equals('created');
        res.body.feed[0].answerId.should.equals('9');
        res.body.feed[0].commitmentId.should.equals('100');
        res.body.feed[0].commitmentSlug.should.equals('test-commitment');
        res.body.feed[0].title.should.equals('Test Commitment');
        res.body.feed[0].description.should.equals('commitmentDescription');
        res.body.feed[0].imageUrl.should.equals(`${process.env.PUBLIC_IMAGE_BASE_URL}/commitment/100/460x460/title.jpg?v=606`);
        res.body.feed[0].questionId.should.equals('2');
        res.body.feed[0].question.should.equals('Das ist eine Frage2');
        res.body.feed[0].questionSlug.should.equals('das-ist-eine-frage2');
        res.body.feed[0].regions.length.should.equals(2);
        res.body.feed[0].regions.should.includes('region-1');
        res.body.feed[0].regions.should.includes('region-2');
        res.body.feed[0].created.should.equals(605);
        res.body.feed[0].user.userId.should.equals('2');
        res.body.feed[0].user.name.should.equals('user Meier2');
        res.body.feed[0].user.slug.should.equals('user-meier2');
        res.body.feed[0].user.userImage.should.equals('profileImage/2/thumbnail.jpg');
        res.body.feed[0].user.userImagePreview.should.equals('profileImage/2/profilePreview.jpg');
        res.body.feed[0].user.isLoggedInUser.should.equals(false);
        res.body.feed[0].user.isTrustUser.should.equals(false);
        should.not.exist(res.body.feed[0].creator);

        res.body.feed[1].type.should.equals('Link');
        res.body.feed[1].pageType.should.equals('article');
        res.body.feed[1].action.should.equals('created');
        res.body.feed[1].answerId.should.equals('8');
        res.body.feed[1].title.should.equals('link8Title');
        res.body.feed[1].description.should.equals('link8Description');
        res.body.feed[1].link.should.equals('https://www.example.org/blog/1224');
        res.body.feed[1].imageUrl.should.equals(`${process.env.PUBLIC_IMAGE_BASE_URL}/link/8/460x460/preview.jpg`);
        res.body.feed[1].questionId.should.equals('2');
        res.body.feed[1].question.should.equals('Das ist eine Frage2');
        res.body.feed[1].questionSlug.should.equals('das-ist-eine-frage2');
        res.body.feed[1].created.should.equals(604);
        res.body.feed[1].user.userId.should.equals('1');
        res.body.feed[1].user.name.should.equals('user Meier');
        res.body.feed[1].user.slug.should.equals('user-meier');
        res.body.feed[1].user.userImage.should.equals('profileImage/1/thumbnail.jpg');
        res.body.feed[1].user.userImagePreview.should.equals('profileImage/1/profilePreview.jpg');
        res.body.feed[1].user.isLoggedInUser.should.equals(true);
        res.body.feed[1].user.isTrustUser.should.equals(false);
        should.not.exist(res.body.feed[1].creator);

        res.body.feed[2].type.should.equals('Youtube');
        res.body.feed[2].action.should.equals('created');
        res.body.feed[2].answerId.should.equals('7');
        res.body.feed[2].title.should.equals('youtube7Title');
        res.body.feed[2].description.should.equals('youtube7Description');
        res.body.feed[2].idOnYoutube.should.equals('00zxopGPYW4');
        res.body.feed[2].linkEmbed.should.equals('https://www.youtube.com/embed/00zxopGPYW4');
        res.body.feed[2].link.should.equals('https://www.youtube.com/watch?v=00zxopGPYW4');
        res.body.feed[2].questionId.should.equals('2');
        res.body.feed[2].question.should.equals('Das ist eine Frage2');
        res.body.feed[2].questionSlug.should.equals('das-ist-eine-frage2');
        res.body.feed[2].created.should.equals(603);
        res.body.feed[2].user.userId.should.equals('2');
        res.body.feed[2].user.name.should.equals('user Meier2');
        res.body.feed[2].user.slug.should.equals('user-meier2');
        res.body.feed[2].user.userImage.should.equals('profileImage/2/thumbnail.jpg');
        res.body.feed[2].user.userImagePreview.should.equals('profileImage/2/profilePreview.jpg');
        res.body.feed[2].user.isLoggedInUser.should.equals(false);
        res.body.feed[2].user.isTrustUser.should.equals(false);
        should.not.exist(res.body.feed[2].creator);
    });

    it('Upcoming event of an commitment the user watches', async function () {
        dbDsl.watchCommitment({commitmentId: '100', userId: '1'});
        dbDsl.createCommitmentEvent({commitmentId: '100', eventId: '22', created: 777,
            startDate: startTime - 100, endDate: startTime + 200, region: 'region-1'});
        dbDsl.createCommitmentEvent({commitmentId: '100', eventId: '23', created: 778,
            startDate: startTime - 200, endDate: startTime - 100, region: 'region-1'});
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.get('/api/user/feed');
        res.status.should.equal(200);
        res.body.timestamp.should.least(startTime);
        res.body.totalNumberOfElements.should.equals(1);
        res.body.feed.length.should.equals(1);

        res.body.feed[0].type.should.equals('Event');
        res.body.feed[0].action.should.equals('created');
        res.body.feed[0].commitmentId.should.equals('100');
        res.body.feed[0].commitmentSlug.should.equals('test-commitment');
        res.body.feed[0].commitmentTitle.should.equals('Test Commitment');
        res.body.feed[0].eventId.should.equals('22');
        res.body.feed[0].created.should.equals(777);
        res.body.feed[0].title.should.equals('event22Title');
        res.body.feed[0].description.should.equals('event22Description');
        res.body.feed[0].region.should.equals('region-1');
        res.body.feed[0].location.should.equals('event22Location');
        res.body.feed[0].startDate.should.equals(startTime - 100);
        res.body.feed[0].endDate.should.equals(startTime + 200);
    });

    it('Watching a question does not duplicate feed entries (created answer form user in trust circle)', async function () {

        dbDsl.createContactConnection('1', '9');
        dbDsl.createQuestion('3', {
            creatorId: '8', question: 'Das ist eine Frage2', description: 'Test elyoos.org change the world',
            topics: ['Health'], language: 'de', created: 602,
        });
        dbDsl.createYoutubeAnswer('7', {
            creatorId: '9', questionId: '3', created: 603, idOnYoutube: '00zxopGPYW4',
            link: 'https://www.youtube.com/watch?v=00zxopGPYW4', linkEmbed: 'https://www.youtube.com/embed/00zxopGPYW4'
        });
        dbDsl.watchQuestion({questionId: '3', userId: '1', created: 999});

        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.get('/api/user/feed');
        res.status.should.equal(200);
        res.body.timestamp.should.least(startTime);
        res.body.totalNumberOfElements.should.equals(1);
        res.body.feed.length.should.equals(1);

        res.body.feed[0].type.should.equals('Youtube');
        res.body.feed[0].answerId.should.equals('7');
    });

    it('Watching a question does not duplicate feed entries (up voted answer form user in a trust circle)', async function () {

        dbDsl.createContactConnection('1', '9');
        dbDsl.createQuestion('3', {
            creatorId: '8', question: 'Das ist eine Frage2', description: 'Test elyoos.org change the world',
            topics: ['Health'], language: 'de', created: 602,
        });
        dbDsl.createYoutubeAnswer('7', {
            creatorId: '8', questionId: '3', created: 603, idOnYoutube: '00zxopGPYW4',
            link: 'https://www.youtube.com/watch?v=00zxopGPYW4', linkEmbed: 'https://www.youtube.com/embed/00zxopGPYW4'
        });
        dbDsl.upVoteAnswer({userId: '9', answerId: '7', created: 777});
        dbDsl.watchQuestion({questionId: '3', userId: '1', created: 999});

        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.get('/api/user/feed');
        res.status.should.equal(200);
        res.body.timestamp.should.least(startTime);
        res.body.totalNumberOfElements.should.equals(2);
        res.body.feed.length.should.equals(2);

        res.body.feed[0].type.should.equals('Youtube');
        res.body.feed[0].action.should.equals('upVote');
        res.body.feed[0].answerId.should.equals('7');

        res.body.feed[1].type.should.equals('Youtube');
        res.body.feed[1].action.should.equals('created');
        res.body.feed[1].answerId.should.equals('7');
    });

    it('Newly created answers by users from the Trust Circle', async function () {
        dbDsl.createContactConnection('1', '6');
        dbDsl.createContactConnection('1', '7');
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        await requestHandler.login(users.validUser);
        let res = await requestHandler.get('/api/user/feed');
        res.status.should.equal(200);
        res.body.timestamp.should.least(startTime);
        res.body.totalNumberOfElements.should.equals(2);
        res.body.feed.length.should.equals(2);

        res.body.feed[0].type.should.equals('Book');
        res.body.feed[0].action.should.equals('created');
        res.body.feed[0].answerId.should.equals('6');
        res.body.feed[0].title.should.equals('book6Title');
        res.body.feed[0].description.should.equals('book6Description');
        res.body.feed[0].imageUrl.should.equals(`${process.env.PUBLIC_IMAGE_BASE_URL}/book/6/120x250/preview.jpg`);
        res.body.feed[0].questionId.should.equals('1');
        res.body.feed[0].question.should.equals('Das ist eine Frage');
        res.body.feed[0].questionSlug.should.equals('das-ist-eine-frage');
        res.body.feed[0].created.should.equals(601);
        res.body.feed[0].user.userId.should.equals('7');
        res.body.feed[0].user.name.should.equals('user Meier7');
        res.body.feed[0].user.slug.should.equals('user-meier7');
        res.body.feed[0].user.userImage.should.equals('profileImage/7/thumbnail.jpg');
        res.body.feed[0].user.userImagePreview.should.equals('profileImage/7/profilePreview.jpg');
        res.body.feed[0].user.isLoggedInUser.should.equals(false);
        res.body.feed[0].user.isTrustUser.should.equals(true);
        should.not.exist(res.body.feed[0].creator);

        res.body.feed[1].type.should.equals('Text');
        res.body.feed[1].action.should.equals('created');
        res.body.feed[1].answerId.should.equals('5');
        res.body.feed[1].answer.should.equals('Answer');
        res.body.feed[1].questionId.should.equals('1');
        res.body.feed[1].question.should.equals('Das ist eine Frage');
        res.body.feed[1].questionSlug.should.equals('das-ist-eine-frage');
        res.body.feed[1].created.should.equals(600);
        res.body.feed[1].user.userId.should.equals('6');
        res.body.feed[1].user.name.should.equals('user Meier6');
        res.body.feed[1].user.slug.should.equals('user-meier6');
        res.body.feed[1].user.userImage.should.equals('profileImage/6/thumbnail.jpg');
        res.body.feed[1].user.userImagePreview.should.equals('profileImage/6/profilePreview.jpg');
        res.body.feed[1].user.isLoggedInUser.should.equals(false);
        res.body.feed[1].user.isTrustUser.should.equals(true);
        should.not.exist(res.body.feed[1].creator);
    });

    it('Newly created questions by users from the Trust Circle', async function () {
        dbDsl.createContactConnection('1', '3');
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.get('/api/user/feed');
        res.status.should.equal(200);
        res.body.timestamp.should.least(startTime);
        res.body.totalNumberOfElements.should.equals(1);
        res.body.feed.length.should.equals(1);

        res.body.feed[0].type.should.equals('Question');
        res.body.feed[0].action.should.equals('created');
        res.body.feed[0].questionId.should.equals('2');
        res.body.feed[0].question.should.equals('Das ist eine Frage2');
        res.body.feed[0].questionSlug.should.equals('das-ist-eine-frage2');
        res.body.feed[0].description.should.equals('Test elyoos.org change the world');
        res.body.feed[0].descriptionHtml.should.equals(`Test <a href="http://elyoos.org" class="linkified" target="_blank">elyoos.org</a> change the world`);
        res.body.feed[0].created.should.equals(602);
        res.body.feed[0].numberOfAnswers.should.equals(3);
        res.body.feed[0].user.userId.should.equals('3');
        res.body.feed[0].user.name.should.equals('user Meier3');
        res.body.feed[0].user.slug.should.equals('user-meier3');
        res.body.feed[0].user.userImage.should.equals('profileImage/3/thumbnail.jpg');
        res.body.feed[0].user.userImagePreview.should.equals('profileImage/3/profilePreview.jpg');
        res.body.feed[0].user.isLoggedInUser.should.equals(false);
        res.body.feed[0].user.isTrustUser.should.equals(true);
        should.not.exist(res.body.feed[0].creator);
    });

    it('A user from the Trust Circle watches a question', async function () {
        dbDsl.createContactConnection('1', '9');
        dbDsl.watchQuestion({questionId: '2', userId: '9', created: 999});
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.get('/api/user/feed');
        res.status.should.equal(200);
        res.body.timestamp.should.least(startTime);
        res.body.totalNumberOfElements.should.equals(1);
        res.body.feed.length.should.equals(1);

        res.body.feed[0].type.should.equals('Question');
        res.body.feed[0].action.should.equals('watch');
        res.body.feed[0].questionId.should.equals('2');
        res.body.feed[0].question.should.equals('Das ist eine Frage2');
        res.body.feed[0].questionSlug.should.equals('das-ist-eine-frage2');
        res.body.feed[0].descriptionHtml.should.equals(`Test <a href="http://elyoos.org" class="linkified" target="_blank">elyoos.org</a> change the world`);
        res.body.feed[0].created.should.equals(999);
        res.body.feed[0].numberOfAnswers.should.equals(3);
        res.body.feed[0].user.userId.should.equals('9');
        res.body.feed[0].user.name.should.equals('user Meier9');
        res.body.feed[0].user.slug.should.equals('user-meier9');
        res.body.feed[0].user.userImage.should.equals('profileImage/9/thumbnail.jpg');
        res.body.feed[0].user.userImagePreview.should.equals('profileImage/9/profilePreview.jpg');
        res.body.feed[0].user.isLoggedInUser.should.equals(false);
        res.body.feed[0].user.isTrustUser.should.equals(true);
        res.body.feed[0].creator.userId.should.equals('3');
        res.body.feed[0].creator.name.should.equals('user Meier3');
        res.body.feed[0].creator.slug.should.equals('user-meier3');
        res.body.feed[0].creator.userImage.should.equals('profileImage/3/thumbnail.jpg');
        res.body.feed[0].creator.userImagePreview.should.equals('profileImage/3/profilePreview.jpg');
        res.body.feed[0].creator.isLoggedInUser.should.equals(false);
        res.body.feed[0].creator.isTrustUser.should.equals(false);
    });

    it('A user from the Trust Circle watches a commitment', async function () {
        dbDsl.createContactConnection('1', '9');
        dbDsl.watchCommitment({commitmentId: '100', userId: '9', created: 999});
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.get('/api/user/feed');
        res.status.should.equal(200);
        res.body.timestamp.should.least(startTime);
        res.body.totalNumberOfElements.should.equals(1);
        res.body.feed.length.should.equals(1);

        res.body.feed[0].type.should.equals('Commitment');
        res.body.feed[0].action.should.equals('watch');
        res.body.feed[0].commitmentId.should.equals('100');
        res.body.feed[0].commitmentSlug.should.equals('test-commitment');
        res.body.feed[0].title.should.equals('Test Commitment');
        res.body.feed[0].description.should.equals('commitment100Description');
        res.body.feed[0].imageUrl.should.equals(`${process.env.PUBLIC_IMAGE_BASE_URL}/commitment/100/460x460/title.jpg?v=606`);
        res.body.feed[0].regions.length.should.equals(2);
        res.body.feed[0].regions.should.include('region-1');
        res.body.feed[0].regions.should.include('region-2');
        res.body.feed[0].created.should.equals(999);
        res.body.feed[0].user.userId.should.equals('9');
        res.body.feed[0].user.name.should.equals('user Meier9');
        res.body.feed[0].user.slug.should.equals('user-meier9');
        res.body.feed[0].user.userImage.should.equals('profileImage/9/thumbnail.jpg');
        res.body.feed[0].user.userImagePreview.should.equals('profileImage/9/profilePreview.jpg');
        res.body.feed[0].user.isLoggedInUser.should.equals(false);
        res.body.feed[0].user.isTrustUser.should.equals(true);
        should.not.exist(res.body.feed[0].creator);
    });

    it('A user from the Trust Circle created a commitment', async function () {
        dbDsl.createContactConnection('1', '9');
        dbDsl.createCommitment('101', {
            adminId: '9',
            topics: ['Spiritual'],
            language: 'de',
            created: 555,
            modified: 607,
            title: 'Test Commitment',
            website: 'https://www.example.org/',
            regions: ['region-1']
        });
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.get('/api/user/feed');
        res.status.should.equal(200);
        res.body.timestamp.should.least(startTime);
        res.body.totalNumberOfElements.should.equals(1);
        res.body.feed.length.should.equals(1);

        res.body.feed[0].type.should.equals('Commitment');
        res.body.feed[0].action.should.equals('created');
        res.body.feed[0].commitmentId.should.equals('101');
        res.body.feed[0].commitmentSlug.should.equals('test-commitment');
        res.body.feed[0].title.should.equals('Test Commitment');
        res.body.feed[0].description.should.equals('commitment101Description');
        res.body.feed[0].imageUrl.should.equals(`${process.env.PUBLIC_IMAGE_BASE_URL}/commitment/101/460x460/title.jpg?v=607`);
        res.body.feed[0].regions.length.should.equals(1);
        res.body.feed[0].regions.should.include('region-1');
        res.body.feed[0].created.should.equals(555);
        res.body.feed[0].user.userId.should.equals('9');
        res.body.feed[0].user.name.should.equals('user Meier9');
        res.body.feed[0].user.slug.should.equals('user-meier9');
        res.body.feed[0].user.userImage.should.equals('profileImage/9/thumbnail.jpg');
        res.body.feed[0].user.userImagePreview.should.equals('profileImage/9/profilePreview.jpg');
        res.body.feed[0].user.isLoggedInUser.should.equals(false);
        res.body.feed[0].user.isTrustUser.should.equals(true);
        should.not.exist(res.body.feed[0].creator);
    });

    it('Up vote of an answer by users from the Trust Circle', async function () {
        dbDsl.createContactConnection('1', '9');
        dbDsl.upVoteAnswer({userId: '9', answerId: '8', created: 999});
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.get('/api/user/feed');
        res.status.should.equal(200);
        res.body.timestamp.should.least(startTime);
        res.body.totalNumberOfElements.should.equals(1);
        res.body.feed.length.should.equals(1);

        res.body.feed[0].type.should.equals('Link');
        res.body.feed[0].pageType.should.equals('article');
        res.body.feed[0].action.should.equals('upVote');
        res.body.feed[0].answerId.should.equals('8');
        res.body.feed[0].title.should.equals('link8Title');
        res.body.feed[0].description.should.equals('link8Description');
        res.body.feed[0].link.should.equals('https://www.example.org/blog/1224');
        res.body.feed[0].imageUrl.should.equals(`${process.env.PUBLIC_IMAGE_BASE_URL}/link/8/460x460/preview.jpg`);
        res.body.feed[0].questionId.should.equals('2');
        res.body.feed[0].question.should.equals('Das ist eine Frage2');
        res.body.feed[0].questionSlug.should.equals('das-ist-eine-frage2');
        res.body.feed[0].created.should.equals(999);
        res.body.feed[0].user.userId.should.equals('9');
        res.body.feed[0].user.name.should.equals('user Meier9');
        res.body.feed[0].user.slug.should.equals('user-meier9');
        res.body.feed[0].user.userImage.should.equals('profileImage/9/thumbnail.jpg');
        res.body.feed[0].user.isLoggedInUser.should.equals(false);
        res.body.feed[0].user.isTrustUser.should.equals(true);
        res.body.feed[0].creator.userId.should.equals('1');
        res.body.feed[0].creator.name.should.equals('user Meier');
        res.body.feed[0].creator.slug.should.equals('user-meier');
        res.body.feed[0].creator.userImage.should.equals('profileImage/1/thumbnail.jpg');
        res.body.feed[0].creator.userImagePreview.should.equals('profileImage/1/profilePreview.jpg');
        res.body.feed[0].creator.isLoggedInUser.should.equals(true);
        res.body.feed[0].creator.isTrustUser.should.equals(false);
    });

    it('Hide answers created by the user', async function () {
        dbDsl.createTextAnswer('21', {
            creatorId: '1', questionId: '1', answer: 'Answer', created: 600,
        });
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.get('/api/user/feed');
        res.status.should.equal(200);
        res.body.timestamp.should.least(startTime);
        res.body.totalNumberOfElements.should.equals(0);
        res.body.feed.length.should.equals(0);
    });

    it('Hide question created by the user', async function () {
        dbDsl.createQuestion('21', {
            creatorId: '1', question: 'Das ist eine Frage', description: 'Test elyoos.org change the world1',
            topics: ['Spiritual', 'Education'], language: 'de', created: 500, modified: 700
        });
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.get('/api/user/feed');
        res.status.should.equal(200);
        res.body.timestamp.should.least(startTime);
        res.body.totalNumberOfElements.should.equals(0);
        res.body.feed.length.should.equals(0);
    });

    it('Hide commitment created by the user', async function () {
        dbDsl.createCommitment('101', {
            adminId: '1',
            topics: ['Spiritual', 'Education'],
            language: 'de',
            created: 400,
            modified: 606,
            title: 'Test Commitment',
            website: 'https://www.example.org/',
            regions: ['region-1']
        });
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.get('/api/user/feed');
        res.status.should.equal(200);
        res.body.timestamp.should.least(startTime);
        res.body.totalNumberOfElements.should.equals(0);
        res.body.feed.length.should.equals(0);
    });
});
