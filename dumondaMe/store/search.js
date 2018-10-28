import Vue from 'vue';

export const state = () => ({
    lastQuery: '', users: [], questions: [], commitments: [],
    hasMoreUsers: false, hasMoreQuestions: false, hasMoreCommitments: false
});

export const mutations = {
    SET_LAST_QUERY(state, query) {
        state.lastQuery = query;
    },
    SET_USERS(state, {users, hasMoreUsers}) {
        state.users = users;
        state.hasMoreUsers = hasMoreUsers;
    },
    ADD_USERS(state, {users, hasMoreUsers}) {
        state.users = state.users.concat(users);
        state.hasMoreUsers = hasMoreUsers;
    },
    SET_COMMITMENTS(state, {commitments, hasMoreCommitments}) {
        state.commitments = commitments;
        state.hasMoreCommitments = hasMoreCommitments;
    },
    ADD_COMMITMENTS(state, {commitments, hasMoreCommitments}) {
        state.commitments = state.commitments.concat(commitments);
        state.hasMoreCommitments = hasMoreCommitments;
    },
    SET_QUESTIONS(state, {questions, hasMoreQuestions}) {
        state.questions = questions;
        state.hasMoreQuestions = hasMoreQuestions;
    },
    ADD_QUESTIONS(state, {questions, hasMoreQuestions}) {
        state.questions = state.questions.concat(questions);
        state.hasMoreQuestions = hasMoreQuestions;
    },
    ADD_QUESTION_WATCH(state, questionId) {
        let question = state.questions.find((element) => element.questionId === questionId);
        question.numberOfWatches++;
        question.isWatchedByUser = true;
    },
    REMOVE_QUESTION_WATCH(state, questionId) {
        let question = state.questions.find((element) => element.questionId === questionId);
        question.numberOfWatches--;
        question.isWatchedByUser = false;
    },
    REMOVE_USER_FROM_TRUST_CIRCLE: function (state, userId) {
        let user = state.users.find((user) => user.userId === userId);
        if (user) {
            Vue.set(user, 'isTrustUser', false);
        }
        for (let question of state.questions) {
            if (question.user.userId === userId) {
                Vue.set(question.user, 'isTrustUser', false);
            }
        }
    },
    ADD_USER_TO_TRUST_CIRCLE: function (state, userId) {
        let user = state.users.find((user) => user.userId === userId);
        if (user) {
            Vue.set(user, 'isTrustUser', true);
        }
        for (let question of state.questions) {
            if (question.user.userId === userId) {
                Vue.set(question.user, 'isTrustUser', true);
            }
        }
    }
};

const NUMBER_OF_NEXT_ELEMENTS = 10;

export const actions = {
    async search({commit, state, rootState}, query) {
        let response = await this.$axios.$get(`/search`, {params: {query: query, lang: rootState.i18n.language}});
        commit('SET_LAST_QUERY', query);
        commit('SET_USERS', {users: response.users, hasMoreUsers: response.hasMoreUsers});
        commit('SET_COMMITMENTS', {commitments: response.commitments, hasMoreCommitments: response.hasMoreCommitments});
        commit('SET_QUESTIONS', {questions: response.questions, hasMoreQuestions: response.hasMoreQuestions});
    },
    async searchNextUsers({commit, state, rootState}) {
        let response = await this.$axios.$get(`/search/users`, {
            params: {
                query: state.lastQuery, lang: rootState.i18n.language, skip: state.users.length,
                limit: NUMBER_OF_NEXT_ELEMENTS
            }
        });
        commit('ADD_USERS', {users: response.users, hasMoreUsers: response.hasMoreUsers});
    },
    async searchNextQuestions({commit, state, rootState}) {
        let response = await this.$axios.$get(`/search/questions`, {
            params: {
                query: state.lastQuery, lang: rootState.i18n.language, skip: state.questions.length,
                limit: NUMBER_OF_NEXT_ELEMENTS
            }
        });
        commit('ADD_QUESTIONS', {questions: response.questions, hasMoreQuestions: response.hasMoreQuestions});
    },
    async searchNextCommitments({commit, state, rootState}) {
        let response = await this.$axios.$get(`/search/commitments`, {
            params: {
                query: state.lastQuery, lang: rootState.i18n.language, skip: state.commitments.length,
                limit: NUMBER_OF_NEXT_ELEMENTS
            }
        });
        commit('ADD_COMMITMENTS', {commitments: response.commitments, hasMoreCommitments: response.hasMoreCommitments});
    }
};
