import Vue from 'vue';

export const state = () => ({
    users: [], questions: [], commitments: []
});

export const mutations = {
    SET_USERS(state, users) {
        state.users = users;
    },
    SET_COMMITMENTS(state, commitments) {
        state.commitments = commitments;
    },
    SET_QUESTIONS(state, questions) {
        state.questions = questions;
    },
    REMOVE_USER_FROM_TRUST_CIRCLE: function (state, userId) {
        let user = state.users.find((user) => user.userId === userId);
        Vue.set(user, 'isTrustUser', false);
    },
    ADD_USER_TO_TRUST_CIRCLE: function (state, userId) {
        let user = state.users.find((user) => user.userId === userId);
        Vue.set(user, 'isTrustUser', true);
    }
};


export const actions = {
    async search({commit, state, rootState}, query) {
        let response = await this.$axios.$get(`/search`, {params: {query: query, lang: rootState.i18n.language}});
        commit('SET_USERS', response.users);
        commit('SET_COMMITMENTS', response.commitments);
        commit('SET_QUESTIONS', response.questions);
    }
};
