'use strict';

let db = requireDb();

let getOpenBugs = function () {
    return db.cypher().match("(bug:Feedback:Bug {status: 'open'})")
        .return("count(bug) AS numberOfBugs").end();
};

let getOpenIdeas = function () {
    return db.cypher().match("(idea:Feedback:Idea {status: 'open'})")
        .return("count(idea) AS numberOfIdeas").end();
};

let getOpenDiscussions = function () {
    return db.cypher().match("(discussion:Feedback:Discussion {status: 'open'})")
        .return("count(discussion) AS numberOfDiscussions").end();
};

let getNumberOf = function (resp, elementName) {
    if (resp.length > 0) {
        return resp[0][elementName];
    }
    return 0;
};

let getOverview = function () {

    let commands = [];

    commands.push(getOpenBugs().getCommand());
    commands.push(getOpenIdeas().getCommand());

    return getOpenDiscussions()
        .send(commands).then(function (resp) {
            let numberOfBugs = getNumberOf(resp[0], 'numberOfBugs');
            let numberOfIdeas = getNumberOf(resp[1], 'numberOfIdeas');
            let numberOfDiscussions = getNumberOf(resp[2], 'numberOfDiscussions');
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
