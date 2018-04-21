export const state = () => ({
    feed: [],
    timestamp: Number.MAX_SAFE_INTEGER
});

export const mutations = {
    SET_FEED(state, feed) {
        state.feed = feed;
    },
    SET_TIMESTAMP(state, timestamp) {
        state.timestamp = timestamp;
    }
};

export const actions = {
    async getQuestionFeed({commit, state}, {page, isAuthenticated}) {
        let params;
        if (page > 0) {
            params = {page, timestamp: state.timestamp}
        }
        let response;
        if (isAuthenticated) {
            response = await this.$axios.$get(`/feed/question`, params);
        } else {
            response = await this.$axios.$get(`/feed/public/question`, params);
        }
        commit('SET_FEED', response.feed);
        if (!page) {
            commit('SET_TIMESTAMP', response.timestamp);
        }
    }
};
