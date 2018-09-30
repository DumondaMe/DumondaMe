let setUserAuthentication = function (commit, req) {
    commit('auth/SET_USER_IS_AUTHENTICATED', req.isAuthenticated());
};

let initFeedFilter = function (commit, description) {
    commit('feedFilter/SET_REGION_FILTER', {id: 'international', description})
};

let initRecaptcha = function (commit) {
    commit('recaptcha/SET_RECAPTCHA_SITE_KEY', process.env.RECAPTCHA_SITE_KEY)
};

let initUser = function (commit, req) {
    if (req.user && req.user.id) {
        commit('user/SET_USER_ID', req.user.id);
    }
};

export const actions = {

    nuxtServerInit({commit}, {req, app}) {
        setUserAuthentication(commit, req);
        if (req.isAuthenticated()) {
            commit('feedFilter/SET_MAIN_FILTER', 'activity')
        }
        initFeedFilter(commit, app.i18n.i18next.t('common:international'));
        initRecaptcha(commit);
        initUser(commit, req);
    }
};