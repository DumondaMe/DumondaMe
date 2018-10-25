'use strict';

const user = require('./user/index');
const userResponse = require('./user/response');
const commitment = require('./commitment/index');
const commitmentResponse = require('./commitment/response');
const question = require('./question/index');
const questionResponse = require('./question/response');

const search = async function (query, language, userId) {
    let result = await user.searchCommand(query, language, userId, 0, 6)
        .send([commitment.searchCommand(query, language, userId, 0, 6).getCommand(),
            question.searchCommand(query, language, userId, 0, 6).getCommand()]);
    return {
        users: await userResponse.getResponse(result[2], userId),
        questions: await questionResponse.getResponse(result[1], userId),
        commitments: commitmentResponse.getResponse(result[0])
    };
};

module.exports = {
    search
};
