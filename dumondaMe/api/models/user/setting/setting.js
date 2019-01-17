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

let emailNotificationSettings = function (setting) {
    return {
        enabledEmailNotifications: setting.userLabels.includes('EMailNotificationEnabled'),
        enableInviteToAnswerQuestion: !setting.disableInviteAnswerQuestionNotification,
        enableNewNotifications: !setting.disableNewNotificationEmail
    }
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
    setting.emailNotifications = emailNotificationSettings(setting);

    delete setting.topics;
    delete setting.disableInviteAnswerQuestionNotification;
    delete setting.disableNewNotificationEmail;
    delete setting.userLabels;
    return setting;
};

let getUserSetting = async function (userId) {

    let resp = await db.cypher().match(`(u:User {userId: {userId}})`)
        .optionalMatch(`(u)-[:INTERESTED]->(topic:Topic)`)
        .return(`u.privacyMode AS privacyMode, u.showProfileActivity AS showProfileActivity, u.languages AS languages,
                 u.language AS language, collect(topic) AS topics, labels(u) AS userLabels, 
                 u.disableInviteAnswerQuestionNotification AS disableInviteAnswerQuestionNotification,
                 u.disableNewNotificationEmail AS disableNewNotificationEmail`)
        .end({userId}).send();
    return getResponse(resp[0]);
};

module.exports = {
    getUserSetting
};
