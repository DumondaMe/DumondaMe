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

export const getters = {
    isLoggedInUser: state => {
        return state.user.isLoggedInUser;
    }
};

export const actions = {
    async getProfile({commit}) {
        let user = await this.$axios.$get(`user/profile`);
        commit('SET_USER_PROFILE', user);
    },
    async getProfileOtherUser({commit}, userId) {
        let user = await this.$axios.$get(`user/profile/${userId}`);
        commit('SET_USER_PROFILE', user);
    }
};