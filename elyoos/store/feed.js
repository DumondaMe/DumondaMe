export const state = () => ({
    feed: [],
    page: 0,
    timestamp: Number.MAX_SAFE_INTEGER,
    loading: false
});

export const mutations = {
    SET_FEED(state, feed) {
        state.feed = feed;
    },
    ADD_TO_FEED(state, feed) {
        state.feed = state.feed.concat(feed);
    },
    SET_PAGE(state, page) {
        state.page = page;
    },
    SET_TIMESTAMP(state, timestamp) {
        state.timestamp = timestamp;
    },
    SET_LOADING(state, loading) {
        state.loading = loading;
    }
};

const getFeedRequest = async function (commit, isAuthenticated, params, mainFilter, commitCommand, $axios) {
    try {
        let response;
        commit('SET_LOADING', true);
        if (isAuthenticated) {
            response = await $axios.$get(`/user/feed/${mainFilter}`, params);
        } else {
            response = await $axios.$get(`/feed/${mainFilter}`, params);
        }
        commit(commitCommand, response.feed);
        commit('SET_PAGE', params.params.page);
        return response;
    } finally {
        commit('SET_LOADING', false);
    }
};

export const actions = {
    async getFeed({commit, rootState, rootGetters}) {
        let params = {params: {page: 0, guiLanguage: rootState.i18n.language, languages: ['de', 'en']}};
        params.params = Object.assign(params.params, rootGetters['feedFilter/getFilterParams']);
        let response = await getFeedRequest(commit, rootState.auth.userIsAuthenticated, params,
            rootState.feedFilter.mainFilter, 'SET_FEED', this.$axios);
        commit('SET_TIMESTAMP', response.timestamp);
    },
    async loadNextFeedElements({commit, state, rootState}) {
        let params = {params: {page: state.page + 1, language: rootState.i18n.language}};
        await getFeedRequest(commit, rootState.auth.userIsAuthenticated, params, rootState.feedFilter.mainFilter,
            'ADD_TO_FEED', this.$axios);
    }
};
