export const state = () => ({
    numberOfMainTopics: 0,
    topics: []
});

export const mutations = {
    SET_MAIN_TOPICS: function (state, topics) {
        state.topics = topics;
    },
    ADD_MAIN_TOPIC: function (state, topic) {
        state.topics.push(topic);
    },
    SET_NUMBER_MAIN_TOPICS: function (state, numberOfTopics) {
        state.numberOfMainTopics = numberOfTopics;
    }
};

export const actions = {
    async getTopics({rootState, commit}) {
        let response = await this.$axios.$get('topics', {params: {language: rootState.i18n.language}});
        commit('SET_MAIN_TOPICS', response.topics);
        commit('SET_NUMBER_MAIN_TOPICS', response.numberOfTopics);
    },
    async createMainTopic({commit, state}, {de, similarDe, en, similarEn}) {
        let response = await this.$axios.$post('topics/main', {de, similarDe, en, similarEn});
        commit('ADD_MAIN_TOPIC', {de, similarDe, en, similarEn, topicId: response.topicId});
        commit('SET_NUMBER_MAIN_TOPICS', state.numberOfMainTopics + 1);
    }
};