'use strict';

let db = requireDb();
let cdn = require("../util/cdn");

let getNumberOfUser = function () {
    return db.cypher().match(`(user:User)`)
        .return("count(user) AS numberOfUser").end();
};

let getOverviewOfUser = function (params) {
    return db.cypher().match(`(user:User)`)
        .return("user").orderBy("user.registerDate DESC").skip("{skip}").limit("{maxItems}").end(params);
};

let getUser = function (users) {
    let formattedUsers = [];
    users.forEach(function (user) {
        let formattedUser = {};
        formattedUser.userId = user.user.userId;
        formattedUser.name = user.user.name;
        formattedUser.registerDate = user.user.registerDate;
        formattedUser.url = cdn.getUrl(`profileImage/${user.user.userId}/thumbnail.jpg`);
        formattedUsers.push(formattedUser);
    });
    return formattedUsers;
};

let getOverview = function (params) {

    let commands = [];

    commands.push(getOverviewOfUser(params).getCommand());

    return getNumberOfUser().send(commands).then(function (resp) {
        return {
            numberOfUser: resp[1][0].numberOfUser, user: getUser(resp[0])
        };
    });
};


module.exports = {
    getOverview: getOverview
};
