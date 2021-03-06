'use strict';

const db = requireDb();
const cdn = require('dumonda-me-server-lib').cdn;

const getNumberOfUser = function () {
    return db.cypher().match(`(user:User)`)
        .where(`NOT user:HarvestingUser`)
        .return("count(user) AS numberOfUser").end();
};

const getOverviewOfUser = function (params) {
    return db.cypher().match(`(user:User)`)
        .where(`NOT user:HarvestingUser`)
        .return("user").orderBy("user.registerDate DESC").skip("{skip}").limit("{maxItems}").end(params);
};

const getUserResponse = async function (users) {
    let formattedUsers = [];
    for (let user of users) {
        let formattedUser = {};
        formattedUser.userId = user.user.userId;
        formattedUser.name = user.user.name;
        formattedUser.registerDate = user.user.registerDate;
        formattedUser.url = await cdn.getSignedUrl(`profileImage/${user.user.userId}/thumbnail.jpg`);
        formattedUsers.push(formattedUser);
    }
    return formattedUsers;
};

const getOverview = async function (params) {

    let commands = [];

    commands.push(getOverviewOfUser(params).getCommand());

    let resp = await getNumberOfUser().send(commands);
    return {
        numberOfUsers: resp[1][0].numberOfUser, users: await getUserResponse(resp[0])
    };
};


module.exports = {
    getOverview,
    getOverviewOfUser,
    getUserResponse,
    getNumberOfUser
};
