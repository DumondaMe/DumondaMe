'use strict';

const user = require('./user/index');
const userResponse = require('./user/response');
const commitment = require('./commitment/index');
const commitmentResponse = require('./commitment/response');
const question = require('./question/index');
const questionResponse = require('./question/response');
const moreSearchResult = require('../util/moreSearchResults');

const NUMBER_OF_ELEMENTS = 6;

const search = async function (query, language, userId) {
    let result = await user.searchCommand(query, language, userId, 0, NUMBER_OF_ELEMENTS + 1)
        .send([commitment.searchCommand(query, language, userId, 0, NUMBER_OF_ELEMENTS + 1).getCommand(),
            question.searchCommand(query, language, userId, 0, NUMBER_OF_ELEMENTS + 1).getCommand()]);

    let hasMoreUsers = moreSearchResult.getHasMoreResults(result[2], NUMBER_OF_ELEMENTS);
    let hasMoreQuestions = moreSearchResult.getHasMoreResults(result[1], NUMBER_OF_ELEMENTS);
    let hasMoreCommitments = moreSearchResult.getHasMoreResults(result[0], NUMBER_OF_ELEMENTS);

    return {
        users: await userResponse.getResponse(result[2], userId), hasMoreUsers,
        questions: await questionResponse.getResponse(result[1], userId), hasMoreQuestions,
        commitments: commitmentResponse.getResponse(result[0]), hasMoreCommitments
    };
};

module.exports = {
    search
};
