let setUserAuthentication = function (commit, req) {
    commit('auth/SET_USER_IS_AUTHENTICATED', req.isAuthenticated());
};

let initRegionFilter = function (commit, description) {
    commit('feedFilter/SET_REGION_FILTER', {id: 'international', description})
};

let initTopicFilter = function (commit, user) {
    if (user && user.topics && user.topics.length > 0) {
        commit('feedFilter/SET_TOPIC_FILTER', user.topics.map(function (topicId) {
            return {id: topicId}
        }));
    }
};

let initRecaptcha = function (commit) {
    commit('recaptcha/SET_RECAPTCHA_SITE_KEY', process.env.RECAPTCHA_SITE_KEY)
};

let initUser = function (commit, req, language) {
    if (req.user && req.user.id) {
        commit('user/SET_USER_ID', req.user.id);
    }
    if (req.user && req.user.infoState) {
        commit('user/SET_USER_INFO_STATE', req.user.infoState);
    }
    if (req.user && req.user.languages) {
        commit('i18n/SET_LANGUAGES', req.user.languages);
    } else {
        commit('i18n/SET_LANGUAGES', [language]);
    }
};

let initDonation = function (commit) {
    commit('donation/SET_ACTUAL_NUMBER', process.env.DONATION_ACTUAL_NUMBER);
    commit('donation/SET_GOAL', process.env.DONATION_GOAL);
};

export const actions = {

    nuxtServerInit({commit}, {req, app, store}) {
        setUserAuthentication(commit, req);
        if (req.isAuthenticated()) {
            commit('feedFilter/SET_MAIN_FILTER', 'activity')
        }
        initRegionFilter(commit, app.i18n.i18next.t('common:international'));
        initTopicFilter(commit, req.user);
        initRecaptcha(commit);
        initUser(commit, req, store.state.i18n.language);
        initDonation(commit);
    }
};