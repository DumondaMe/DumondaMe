'use strict';

const user = require('../register/overview');
const news = require('../news/overview');


const getOverview = async function () {

    let commands = [];
    let params = {skip: 0, maxItems: 10};

    commands.push(user.getOverviewOfUser(params).getCommand());
    commands.push(user.getNumberOfUser().getCommand());

    let resp = await news.getOverviewCommand(params).send(commands);
    return {
        numberOfUser: resp[1][0].numberOfUser, users: await user.getUserResponse(resp[0]),
        news: resp[2]
    };
};


module.exports = {
    getOverview
};
