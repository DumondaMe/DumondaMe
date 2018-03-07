export const state = () => ({
    user: {}
});

export const mutations = {
    SET_USER_PROFILE: function (state, user) {
        state.user = user;
    },
    UPDATE_USER_PROFILE_IMAGE: function (state, image) {
        state.user.profileImage = image;
    }
};

export const actions = {
    async getProfile({commit}) {
        let user = await this.$axios.$get(`user`);
        commit('SET_USER_PROFILE', user);
    }
};