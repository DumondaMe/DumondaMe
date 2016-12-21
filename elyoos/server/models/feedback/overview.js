'use strict';

let db = requireDb();

let getNumberOfOpenFeedback = function (group) {
    return db.cypher().match(`(discussion:Feedback:${group} {status: 'open'})`)
        .return("count(discussion) AS count").end();
};

let getNumberOf = function (resp) {
    if (resp.length > 0) {
        return resp[0].count;
    }
    return 0;
};

let getOverview = function () {

    let commands = [];

    commands.push(getNumberOfOpenFeedback('Bug').getCommand());
    commands.push(getNumberOfOpenFeedback('Idea').getCommand());

    return getNumberOfOpenFeedback('Discussion')
        .send(commands).then(function (resp) {
            let numberOfBugs = getNumberOf(resp[0]);
            let numberOfIdeas = getNumberOf(resp[1]);
            let numberOfDiscussions = getNumberOf(resp[2]);
            return {
                bug: {numberOfBugs: numberOfBugs},
                idea: {numberOfIdeas: numberOfIdeas},
                discussion: {numberOfDiscussions: numberOfDiscussions}
            };
        });
};


module.exports = {
    getOverview: getOverview
};
