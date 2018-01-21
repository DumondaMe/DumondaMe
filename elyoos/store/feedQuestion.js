export const state = () => ({
    questions: [],
    timestamp: Number.MAX_SAFE_INTEGER
});

export const mutations = {
    SET_QUESTIONS(state, questions) {
        state.questions = questions;
    },
    SET_TIMESTAMP(state, timestamp) {
        state.timestamp = timestamp;
    }
};

export const actions = {
    async getQuestionFeed({commit, state}, page) {
        let params;
        if (page > 0) {
            params = {page, timestamp: state.timestamp}
        }
        let response = await this.$axios.$get(`/feed/question`, params);
        commit('SET_QUESTIONS', response.questions);
        if (!page) {
            commit('SET_TIMESTAMP', response.timestamp);
        }
    }
};
