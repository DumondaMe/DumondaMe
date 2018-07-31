import Vue from 'vue';

export const state = () => ({
    numberOfMainTopics: 0,
    topics: []
});

export const getters = {
    getMainTopics: (state, getters, rootState) => {
        let mainTopics = [];
        for (let topic of state.topics) {
            mainTopics.push({topicId: topic.topicId, description: topic[rootState.i18n.language]});
        }
        return mainTopics;
    }
};

const getTopic = function (topics, topicId) {
    for (let topic of topics) {
        if (topic.topicId === topicId) {
            return topic;
        } else if (topic.topics && topic.topics.length > 0) {
            return getTopic(topic.topics, topicId);
        }
    }
    return null;
};

export const mutations = {
    SET_MAIN_TOPICS: function (state, topics) {
        state.topics = topics;
    },
    SET_SUB_TOPICS: function (state, {topics, topicId}) {
        let parentTopic = getTopic(state.topics, topicId);
        Vue.set(parentTopic, 'topics', topics);
    },
    ADD_MAIN_TOPIC: function (state, topic) {
        state.topics.unshift(topic);
    },
    ADD_SUB_TOPIC: function (state, topic) {
        let parentTopic = getTopic(state.topics, topic.parentTopicId);
        if (!parentTopic.topics) {
            Vue.set(parentTopic, 'topics', []);
        }
        topic.numberOfSubTopics = 0;
        topic.topics = [];
        parentTopic.topics.unshift(topic);
        parentTopic.numberOfSubTopics++;
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
    async getSubTopics({rootState, commit}, topicId) {
        let response = await this.$axios.$get('topics/sub', {params: {language: rootState.i18n.language, topicId}});
        commit('SET_SUB_TOPICS', {topics: response.topics, topicId});
    },
    async createMainTopic({commit, state}, {de, similarDe, en, similarEn}) {
        let response = await this.$axios.$post('topics/main', {de, similarDe, en, similarEn});
        commit('ADD_MAIN_TOPIC', {de, similarDe, en, similarEn, topicId: response.topicId});
        commit('SET_NUMBER_MAIN_TOPICS', state.numberOfMainTopics + 1);
    },
    async createSubTopic({commit, state}, {de, similarDe, en, similarEn, parentTopicId}) {
        let response = await this.$axios.$post('topics/sub', {de, similarDe, en, similarEn, parentTopicId});
        commit('ADD_SUB_TOPIC', {de, similarDe, en, similarEn, parentTopicId, topicId: response.topicId});
        commit('SET_NUMBER_MAIN_TOPICS', state.numberOfMainTopics + 1);
    }
};