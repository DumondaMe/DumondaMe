export const state = () => ({
    user: {}
});

export const mutations = {
    SET_USER_PROFILE: function (state, user) {
        state.user = user;
    }
};

export const actions = {
    async getProfile({commit}) {
        let user = await this.$axios.$get(`user`);
        commit('SET_USER_PROFILE', user);
    }
};