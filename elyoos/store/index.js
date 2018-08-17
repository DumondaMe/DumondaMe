let setUserAuthentication = function (commit, req) {
    commit('auth/SET_USER_IS_AUTHENTICATED', req.isAuthenticated());
};

export const actions = {

    nuxtServerInit({commit}, {req}) {
        setUserAuthentication(commit, req);
        if (req.isAuthenticated()) {
            commit('feedFilter/SET_MAIN_FILTER', 'activity')
        }
    }
};