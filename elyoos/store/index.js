let setUserAuthentication = function (commit, req) {
    commit('auth/SET_USER_IS_AUTHENTICATED', req.isAuthenticated());
};

let initFeedFilter = function (commit, description) {
    commit('feedFilter/SET_REGION_FILTER', {id: 'international', description})
};

export const actions = {

    nuxtServerInit({commit}, {req, app}) {
        setUserAuthentication(commit, req);
        if (req.isAuthenticated()) {
            commit('feedFilter/SET_MAIN_FILTER', 'activity')
        }
        //console.log(app.i18n.i18next.t('common:international'))
        initFeedFilter(commit, app.i18n.i18next.t('common:international'));
    }
};