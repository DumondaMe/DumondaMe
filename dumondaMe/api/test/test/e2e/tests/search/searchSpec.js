'use strict';

const users = require('dumonda-me-server-test-util').user;
const dbDsl = require('dumonda-me-server-test-util').dbDSL;
const requestHandler = require('dumonda-me-server-test-util').requestHandler;

describe('Search for user, commitment or question with fuzzy match', function () {

    beforeEach(async function () {
        await dbDsl.init(9);
        dbDsl.createRegion('region-1', {de: 'Region1De', en: 'Region1En'});
        dbDsl.createMainTopic({topicId: 'topic1', descriptionDe: 'topic1De', descriptionEn: 'topic1En'});

        dbDsl.createCommitment('1', {
            title: 'Das ist ein Engagement von Hans Wurst', regions: ['region-1'],
            adminId: '2', topics: ['topic1'], language: 'de', created: 700, modified: 777,
            website: 'https://www.example.org/'
        }, []);
        dbDsl.createCommitment('3', {
            title: 'Irgend ein Engagement', regions: ['region-1'],
            adminId: '2', topics: ['topic1'], language: 'de', created: 700, website: 'https://www.example.org/'
        }, []);
        dbDsl.watchCommitment({commitmentId: '1', userId: '1', created: 999});
        dbDsl.watchCommitment({commitmentId: '1', userId: '3', created: 999});

        dbDsl.createQuestion('10', {
            creatorId: '2', question: 'Das ist eine Frage von Hans Wur', created: 500, modified: 700,
            description: 'Test dumonda.me change the world1', topics: ['topic1'], language: 'de'
        });
        dbDsl.createBookAnswer('6', {
            creatorId: '2', questionId: '10', created: 601, authors: 'Radisli', googleBookId: '1234',
            hasPreviewImage: true
        });
        dbDsl.createBookAnswer('7', {
            creatorId: '2', questionId: '10', created: 601, authors: 'Radisli', googleBookId: '1234',
            hasPreviewImage: true
        });
        dbDsl.createQuestion('12', {
            creatorId: '2', question: 'Irgend eine Frage', description: 'Test dumonda.me change the world2',
            topics: ['topic1'], language: 'de', created: 500, modified: 700
        });
        dbDsl.watchQuestion({userId: '4', questionId: '10', created: 997});

        dbDsl.setUserName('3', {name: 'Hans Wurst3'});

    });

    afterEach(function () {
        return requestHandler.logout();
    });

    it('Autocomplete user, commitment and question (user not logged in, privacy public)', async function () {
        dbDsl.setUserName('8', {name: 'Hans Wurst8'});
        dbDsl.setUserIsHarvestingUser('8', {start: 100, end: 200, link: 'https://www.link.ch', address: 'Milky Way'});
        await dbDsl.sendToDb();
        await dbDsl.setApocIndex();
        let res = await requestHandler.get('/api/search', {query: 'Hans Wurst', lang: 'de'});
        res.status.should.equal(200);
        res.body.hasMoreUsers.should.equals(false);
        res.body.users.length.should.equals(1);
        res.body.users[0].userId.should.equals('3');
        res.body.users[0].name.should.equals('Hans Wurst3');
        res.body.users[0].slug.should.equals('hans-wurst3');
        res.body.users[0].userImage.should.equals('profileImage/3/profilePreview.jpg');
        res.body.users[0].isLoggedInUser.should.equals(false);
        res.body.users[0].isTrustUser.should.equals(false);
        res.body.users[0].isAnonymous.should.equals(false);

        res.body.hasMoreHarvestingUsers.should.equals(false);
        res.body.harvestingUsers.length.should.equals(1);
        res.body.harvestingUsers[0].userId.should.equals('8');
        res.body.harvestingUsers[0].name.should.equals('Hans Wurst8');
        res.body.harvestingUsers[0].slug.should.equals('hans-wurst8');
        res.body.harvestingUsers[0].userImage.should.equals('profileImage/8/profilePreview.jpg');
        res.body.harvestingUsers[0].isLoggedInUser.should.equals(false);

        res.body.hasMoreCommitments.should.equals(false);
        res.body.commitments.length.should.equals(1);
        res.body.commitments[0].commitmentId.should.equals('1');
        res.body.commitments[0].title.should.equals('Das ist ein Engagement von Hans Wurst');
        res.body.commitments[0].slug.should.equals('das-ist-ein-engagement-von-hans-wurst');
        res.body.commitments[0].description.should.equals('commitment1Description');
        res.body.commitments[0].imageUrl.should.equals(`${process.env.PUBLIC_IMAGE_BASE_URL}/commitment/1/120x120/title.jpg?v=777`);
        res.body.commitments[0].numberOfWatches.should.equals(2);
        res.body.commitments[0].isWatchedByUser.should.equals(false);
        res.body.commitments[0].isAdmin.should.equals(false);
        res.body.commitments[0].regions.length.should.equals(1);
        res.body.commitments[0].regions.should.include('Region1De');

        res.body.hasMoreQuestions.should.equals(false);
        res.body.questions.length.should.equals(1);
        res.body.questions[0].questionId.should.equals('10');
        res.body.questions[0].question.should.equals('Das ist eine Frage von Hans Wur');
        res.body.questions[0].slug.should.equals('das-ist-eine-frage-von-hans-wur');
        res.body.questions[0].description.should.equals('Test dumonda.me change the world1');
        res.body.questions[0].descriptionHtml.should.equals(`Test <a href="http://dumonda.me" class="linkified" target="_blank" rel="noopener">dumonda.me</a> change the world1`);
        res.body.questions[0].numberOfAnswers.should.equals(2);
        res.body.questions[0].numberOfWatches.should.equals(1);
        res.body.questions[0].isWatchedByUser.should.equals(false);
        res.body.questions[0].isAdmin.should.equals(false);
        res.body.questions[0].user.userId.should.equals('2');
        res.body.questions[0].user.name.should.equals('user Meier2');
        res.body.questions[0].user.slug.should.equals('user-meier2');
        res.body.questions[0].user.userImage.should.equals('profileImage/2/thumbnail.jpg');
        res.body.questions[0].user.userImagePreview.should.equals('profileImage/2/profilePreview.jpg');
        res.body.questions[0].user.isLoggedInUser.should.equals(false);
        res.body.questions[0].user.isTrustUser.should.equals(false);
        res.body.questions[0].user.isAnonymous.should.equals(false);
    });

    it('Find nothing (user not logged in)', async function () {
        await dbDsl.sendToDb();
        await dbDsl.setApocIndex();
        let res = await requestHandler.get('/api/search', {query: 'asdfasdf kö asdlfjöalsdkjf asdkfö ', lang: 'de'});
        res.status.should.equal(200);
        res.body.hasMoreUsers.should.equals(false);
        res.body.users.length.should.equals(0);
        res.body.commitments.length.should.equals(0);
        res.body.questions.length.should.equals(0);
    });

    it('Autocomplete user, commitment and question (user is logged in, privacy public)', async function () {
        dbDsl.setUserName('8', {name: 'Hans Wurst8'});
        dbDsl.setUserIsHarvestingUser('8', {start: 100, end: 200, link: 'https://www.link.ch', address: 'Milky Way'});
        await dbDsl.sendToDb();
        await dbDsl.setApocIndex();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.get('/api/search', {query: 'Hans Wurst', lang: 'de'});
        res.status.should.equal(200);
        res.body.hasMoreUsers.should.equals(false);
        res.body.users.length.should.equals(1);
        res.body.users[0].userId.should.equals('3');
        res.body.users[0].name.should.equals('Hans Wurst3');
        res.body.users[0].slug.should.equals('hans-wurst3');
        res.body.users[0].userImage.should.equals('profileImage/3/profilePreview.jpg');
        res.body.users[0].isLoggedInUser.should.equals(false);
        res.body.users[0].isTrustUser.should.equals(false);
        res.body.users[0].isAnonymous.should.equals(false);

        res.body.hasMoreHarvestingUsers.should.equals(false);
        res.body.harvestingUsers.length.should.equals(1);
        res.body.harvestingUsers[0].userId.should.equals('8');
        res.body.harvestingUsers[0].name.should.equals('Hans Wurst8');
        res.body.harvestingUsers[0].description.should.equals('superman8');
        res.body.harvestingUsers[0].start.should.equals(100);
        res.body.harvestingUsers[0].end.should.equals(200);
        res.body.harvestingUsers[0].slug.should.equals('hans-wurst8');
        res.body.harvestingUsers[0].userImage.should.equals('profileImage/8/profilePreview.jpg');
        res.body.harvestingUsers[0].isLoggedInUser.should.equals(false);

        res.body.hasMoreCommitments.should.equals(false);
        res.body.commitments.length.should.equals(1);
        res.body.commitments[0].commitmentId.should.equals('1');
        res.body.commitments[0].title.should.equals('Das ist ein Engagement von Hans Wurst');
        res.body.commitments[0].slug.should.equals('das-ist-ein-engagement-von-hans-wurst');
        res.body.commitments[0].description.should.equals('commitment1Description');
        res.body.commitments[0].imageUrl.should.equals(`${process.env.PUBLIC_IMAGE_BASE_URL}/commitment/1/120x120/title.jpg?v=777`);
        res.body.commitments[0].numberOfWatches.should.equals(2);
        res.body.commitments[0].isWatchedByUser.should.equals(true);
        res.body.commitments[0].isAdmin.should.equals(false);
        res.body.commitments[0].regions.length.should.equals(1);
        res.body.commitments[0].regions.should.include('Region1De');

        res.body.hasMoreQuestions.should.equals(false);
        res.body.questions.length.should.equals(1);
        res.body.questions[0].questionId.should.equals('10');
        res.body.questions[0].question.should.equals('Das ist eine Frage von Hans Wur');
        res.body.questions[0].slug.should.equals('das-ist-eine-frage-von-hans-wur');
        res.body.questions[0].description.should.equals('Test dumonda.me change the world1');
        res.body.questions[0].descriptionHtml.should.equals(`Test <a href="http://dumonda.me" class="linkified" target="_blank" rel="noopener">dumonda.me</a> change the world1`);
        res.body.questions[0].numberOfAnswers.should.equals(2);
        res.body.questions[0].numberOfWatches.should.equals(1);
        res.body.questions[0].isWatchedByUser.should.equals(false);
        res.body.questions[0].isAdmin.should.equals(false);
        res.body.questions[0].user.userId.should.equals('2');
        res.body.questions[0].user.name.should.equals('user Meier2');
        res.body.questions[0].user.slug.should.equals('user-meier2');
        res.body.questions[0].user.userImage.should.equals('profileImage/2/thumbnail.jpg');
        res.body.questions[0].user.userImagePreview.should.equals('profileImage/2/profilePreview.jpg');
        res.body.questions[0].user.isLoggedInUser.should.equals(false);
        res.body.questions[0].user.isTrustUser.should.equals(false);
        res.body.questions[0].user.isAnonymous.should.equals(false);
    });

    it('Show user of trust circle first', async function () {
        dbDsl.setUserName('2', {name: 'BenutzerTest'});
        dbDsl.setUserName('3', {name: 'BenutzerTest2'});
        dbDsl.setUserName('4', {name: 'BenutzerTest3'});
        dbDsl.createContactConnection('1', '4');
        dbDsl.createContactConnection('1', '3');
        await dbDsl.sendToDb();
        await dbDsl.setApocIndex();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.get('/api/search', {query: 'BenutzerTest', lang: 'de'});
        res.status.should.equal(200);
        res.body.hasMoreUsers.should.equals(false);
        res.body.users.length.should.equals(3);
        res.body.users[0].userId.should.equals('3');
        res.body.users[1].userId.should.equals('4');
        res.body.users[2].userId.should.equals('2');
    });

    it('Has more users', async function () {
        await dbDsl.sendToDb();
        await dbDsl.setApocIndex();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.get('/api/search', {query: 'user Meier', lang: 'de'});
        res.status.should.equal(200);
        res.body.hasMoreUsers.should.equals(true);
        res.body.users.length.should.equals(6);
    });

    it('Has more harvesting users', async function () {
        for (let index = 2; index < 10; index++) {
            dbDsl.setUserIsHarvestingUser(`${index}`, {start: 100, end: 200, link: 'https://www.link.ch', address: 'Milky Way'});
        }
        await dbDsl.sendToDb();
        await dbDsl.setApocIndex();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.get('/api/search', {query: 'user Meier', lang: 'de'});
        res.status.should.equal(200);
        res.body.hasMoreHarvestingUsers.should.equals(true);
        res.body.harvestingUsers.length.should.equals(6);
    });

    it('Has more questions', async function () {
        for (let index = 0; index < 7; index++) {
            dbDsl.createQuestion(`10${index}`, {
                creatorId: '2', question: 'Has more questions', created: 500, modified: 700,
                description: 'Test dumonda.me change the world1', topics: ['topic1'], language: 'de'
            });
        }
        await dbDsl.sendToDb();
        await dbDsl.setApocIndex();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.get('/api/search', {query: 'Has more questions', lang: 'de'});
        res.status.should.equal(200);
        res.body.hasMoreQuestions.should.equals(true);
        res.body.questions.length.should.equals(6);
    });

    it('Has more commitments', async function () {
        for (let index = 0; index < 7; index++) {
            dbDsl.createCommitment(`10${index}`, {
                title: 'Has more commitments', regions: ['region-1'],
                adminId: '2', topics: ['topic1'], language: 'de', created: 700, modified: 777,
                website: 'https://www.example.org/'
            }, []);
        }
        await dbDsl.sendToDb();
        await dbDsl.setApocIndex();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.get('/api/search', {query: 'Has more commitments', lang: 'de'});
        res.status.should.equal(200);
        res.body.hasMoreCommitments.should.equals(true);
        res.body.commitments.length.should.equals(6);
    });
});
