export const state = () => ({
    topics: []
});

export const mutations = {
    SET_TOPICS(state, topics) {
        state.topics = topics;
    }
};

export const actions = {
    async getTopics({commit, state, rootState}) {
        if (state.topics.length === 0) {
            let topics = await this.$axios.$get(`/topic`, {params: {language: rootState.i18n.language}});
            commit('SET_TOPICS', topics);
        }
    }
};
