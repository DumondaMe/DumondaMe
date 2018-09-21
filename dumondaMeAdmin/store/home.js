export const state = () => ({
    numberOfUsers: 0,
    users: [],
    numberOfTopicSuggestions: 0,
    topicSuggestions: [],
    regions: [],
    nextUsers: 0,
    news: []
});

export const mutations = {
    SET_USERS: function (state, users) {
        state.users = users;
        state.nextUsers += users.length;
    },
    ADD_USERS: function (state, users) {
        state.users = state.users.concat(users);
        state.nextUsers += users.length;
    },
    SET_NUMBER_OF_USERS: function (state, numberOfUsers) {
        state.numberOfUsers = numberOfUsers;
    },
    SET_NEWS: function (state, news) {
        state.news = news;
    },
    SET_TOPIC_SUGGESTIONS: function (state, topicSuggestions) {
        state.topicSuggestions = topicSuggestions;
    },
    SET_NUMBER_OF_TOPIC_SUGGESTIONS: function (state, numberOfTopicSuggestions) {
        state.numberOfTopicSuggestions = numberOfTopicSuggestions;
    },
    SET_REGIONS: function (state, regions) {
        state.regions = regions;
    }
};

export const actions = {
    async getHome({commit}) {
        let response = await this.$axios.$get('home');
        commit('SET_USERS', response.users);
        commit('SET_NUMBER_OF_USERS', response.numberOfUsers);
        commit('SET_NUMBER_OF_TOPIC_SUGGESTIONS', response.numberOfTopicSuggestions);
        commit('SET_TOPIC_SUGGESTIONS', response.topicSuggestions);
        commit('SET_NEWS', response.news);
        commit('SET_REGIONS', response.regions);
    },
    async loadNextUsers({state, commit}) {
        let response = await this.$axios.$get('register/overview',
            {params: {skip: state.nextUsers, maxItems: 20}});
        commit('ADD_USERS', response.users);
    }
};