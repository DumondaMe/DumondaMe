'use strict';

const db = requireDb();
const cdn = require('elyoos-server-lib').cdn;

const getNumberOfUser = function () {
    return db.cypher().match(`(user:User)`)
        .return("count(user) AS numberOfUser").end();
};

const getOverviewOfUser = function (params) {
    return db.cypher().match(`(user:User)`)
        .return("user").orderBy("user.registerDate DESC").skip("{skip}").limit("{maxItems}").end(params);
};

const getUser = async function (users) {
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
        numberOfUser: resp[1][0].numberOfUser, user: await getUser(resp[0])
    };
};


module.exports = {
    getOverview
};
