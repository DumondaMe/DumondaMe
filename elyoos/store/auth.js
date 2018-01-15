export const state = () => ({
    userIsAuthenticated: false
});

export const mutations = {
    SET_USER_IS_AUTHENTICATED: function (state, authenticated) {
        state.userIsAuthenticated = authenticated;
    }
};

export const actions = {
    async login({commit}, {username, password}) {
        try {
            await this.$axios.$post('/login', {username, password});
            commit('SET_USER_IS_AUTHENTICATED', true);
        } catch (error) {
            if (error.response && error.response.status === 401) {
                throw new Error('Bad credentials');
            }
            throw error;
        }
    },

    async logout({commit}) {
        await this.$axios.$post('/logout');
        commit('SET_USER_IS_AUTHENTICATED', false);
    }

};