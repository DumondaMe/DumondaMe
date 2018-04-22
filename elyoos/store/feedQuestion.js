export const state = () => ({
    feed: [],
    typeFilter: null,
    timestamp: Number.MAX_SAFE_INTEGER
});

export const mutations = {
    SET_FEED(state, feed) {
        state.feed = feed;
    },
    SET_TIMESTAMP(state, timestamp) {
        state.timestamp = timestamp;
    },
    SET_TYPE_FILTER(state, filter) {
        state.typeFilter = filter;
    }
};

const getFeed = async function (commit, isAuthenticated, params, $axios) {
    let response;
    if (isAuthenticated) {
        response = await $axios.$get(`/feed/question`, params);
    } else {
        response = await $axios.$get(`/feed/public/question`, params);
    }
    commit('SET_FEED', response.feed);
    return response;
};

export const actions = {
    async getQuestionFeed({commit, state}, {page, isAuthenticated}) {
        let params;
        if (page > 0) {
            params = {page, timestamp: state.timestamp}
        }
        let response = await getFeed(commit, isAuthenticated, params, this.$axios);
        if (!page) {
            commit('SET_TIMESTAMP', response.timestamp);
        }
    },
    async setTypeFilter({commit, state}, {filter, isAuthenticated}) {
        if (filter !== state.typeFilter) {
            commit('SET_TYPE_FILTER', filter);
            let params = null;
            if (filter) {
                params = {params: {typeFilter: filter}}
            }
            await getFeed(commit, isAuthenticated, params, this.$axios);
        }
    }
};
