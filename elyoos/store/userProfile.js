export const state = () => ({
    user: {}
});

export const mutations = {
    SET_USER_PROFILE: function (state, user) {
        state.user = user;
        if (!state.user.userDescription) {
            state.user.userDescription = '';
        }
    },
    CHANGE_USER_DATA: function (state, user) {
        state.user.forename = user.forename;
        state.user.surname = user.surname;
        state.user.userDescription = user.userDescription;
    },
    UPDATE_USER_PROFILE_IMAGE: function (state, image) {
        state.user.profileImage = image;
    },
    REMOVE_USER_FROM_TRUST_CIRCLE: function (state, userId) {
        if (state.user.userId === userId) {
            state.user.loggedInUserIsPersonOfTrust = false;
        } else {
            let user = state.user.peopleOfTrust.find((contact) => contact.userId === userId);
            if (user) {
                delete user.personOfTrustSince;
                user.loggedInUserIsPersonOfTrust = false;
                if (state.user.isLoggedInUser) {
                    state.user.numberOfPeopleOfTrust--;
                }
            }
        }
    },
    ADD_USER_TO_TRUST_CIRCLE: function (state, userToAdd) {
        if (state.user.userId === userToAdd.userId) {
            state.user.loggedInUserIsPersonOfTrust = true;
        } else {
            let user = state.user.peopleOfTrust.find((contact) => contact.userId === userToAdd.userId);
            if (user) {
                user.personOfTrustSince = userToAdd.personOfTrustSince;
                user.loggedInUserIsPersonOfTrust = true;
                if (state.user.isLoggedInUser) {
                    state.user.numberOfPeopleOfTrust++;
                }
            }
        }
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
        let user = await this.$axios.$get(`user/profile/`, {params: {userId}});
        user.userId = userId;
        commit('SET_USER_PROFILE', user);
    },
    async addUserToTrustCircle({commit}, userId) {
        let response = await this.$axios.$post(`user/trustCircle/${userId}`);
        commit('ADD_USER_TO_TRUST_CIRCLE', {userId, personOfTrustSince: response.personOfTrustSince});
    },
    async removeUserFromTrustCircle({commit}, userId) {
        await this.$axios.$delete(`user/trustCircle/${userId}`);
        commit('REMOVE_USER_FROM_TRUST_CIRCLE', userId);
    },
    async uploadUserData({commit}, userProfile) {
        if (typeof userProfile.userDescription === 'string' && userProfile.userDescription.trim().length === 0) {
            delete userProfile.userDescription;
        }
        await this.$axios.$put(`user/profile`, userProfile);
        commit('CHANGE_USER_DATA', userProfile);
    }
};