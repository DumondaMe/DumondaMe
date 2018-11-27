let db = requireDb();

let sortTopics = function (topics, language) {
    topics.sort((a, b) => {
        if (a[language] < b[language]) {
            return -1;
        } else if (a[language] > b[language]) {
            return 1;
        }
        return 0;
    });
};

let getResponse = function (setting) {
    sortTopics(setting.topics, setting.language);

    setting.interestedTopics = [];
    for (let topic of setting.topics) {
        setting.interestedTopics.push({
            id: topic.topicId,
            description: topic[setting.language]
        })
    }
    delete setting.topics;
    return setting;
};

let getUserSetting = async function (userId) {

    let resp = await db.cypher().match(`(u:User {userId: {userId}})`)
        .optionalMatch(`(u)-[:INTERESTED]->(topic:Topic)`)
        .return(`u.privacyMode AS privacyMode, u.showProfileActivity AS showProfileActivity, u.languages AS languages,
                 u.language AS language, collect(topic) AS topics`)
        .end({userId}).send();
    return getResponse(resp[0]);
};

module.exports = {
    getUserSetting
};
