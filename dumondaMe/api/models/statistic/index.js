'use strict';

const db = requireDb();

const getNumberOfNode = function (nodeType) {
  return db.cypher().match(`(:${nodeType})`).return(`count(*) AS numberOf`);
};

const getStatistic = async function () {
    let response = await getNumberOfNode('User').end()
        .send([getNumberOfNode('Question').getCommand(),
            getNumberOfNode('Answer').getCommand(),
            getNumberOfNode('Commitment').getCommand()]);
    return {numberOfUsers: response[3][0].numberOf,
        numberOfQuestions: response[0][0].numberOf,
        numberOfAnswers: response[1][0].numberOf,
        numberOfCommitments: response[2][0].numberOf}
};

module.exports = {
    getStatistic
};
