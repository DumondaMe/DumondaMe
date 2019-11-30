const db = requireDb();

const sortTopics = function (topics, language) {
    topics.sort((a, b) => {
        if (a[language] < b[language]) {
            return -1;
        } else if (a[language] > b[language]) {
            return 1;
        }
        return 0;
    });
};

const getEmailNotificationInterval = function (setting) {
    if (setting.userLabels.includes('EMailNotificationEnabled')) {
        switch (setting.emailNotificationInterval) {
            case 3600:
                return "hour";
            case 86400:
                return "day";
            case 259200:
                return "3days";
            case 604800:
                return "week";
            default:
                return 'unknown'
        }
    }
    return 'never';

};

const getEmail = function (setting) {
    let email = {email: setting.email};
    email.newEmailVerificationIsRunning = !!setting.newEmail;
    if (setting.newEmail) {
        email.newEmail = setting.newEmail;
    }
    return email;
};

const getResponse = function (setting) {
    sortTopics(setting.topics, setting.language);

    let response = {interestedTopics: []};
    for (let topic of setting.topics) {
        response.interestedTopics.push({
            id: topic.topicId,
            description: topic[setting.language]
        })
    }
    response.emailNotificationInterval = getEmailNotificationInterval(setting);
    response.email = getEmail(setting);

    response.privacyMode = setting.privacyMode;
    response.showProfileActivity = setting.showProfileActivity;
    response.languages = setting.languages;
    return response;
};

const getUserSetting = async function (userId) {

    let resp = await db.cypher().match(`(u:User {userId: {userId}})`)
        .optionalMatch(`(u)-[:INTERESTED]->(topic:Topic)`)
        .optionalMatch(`(u)-[:NEW_EMAIL_REQUEST]->(newEmailRequest:NewEMail)`)
        .return(`u.privacyMode AS privacyMode, u.showProfileActivity AS showProfileActivity, u.languages AS languages,
                 u.email AS email, newEmailRequest.email AS newEmail, 
                 u.language AS language, collect(topic) AS topics, labels(u) AS userLabels, 
                 u.emailNotificationInterval AS emailNotificationInterval`)
        .end({userId}).send();
    return getResponse(resp[0]);
};

module.exports = {
    getUserSetting
};
