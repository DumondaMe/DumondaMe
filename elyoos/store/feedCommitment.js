export const state = () => ({
    commitments: [],
    timestamp: Number.MAX_SAFE_INTEGER
});

export const mutations = {
    SET_COMMITMENT(state, commitments) {
        state.commitments = commitments;
    },
    SET_TIMESTAMP(state, timestamp) {
        state.timestamp = timestamp;
    }
};

export const actions = {
    async getCommitmentFeed({commit, state}, page) {
        let params = {region: 'ch'};
        if (page > 0) {
            params.page = page;
            params.timestamp = state.timestamp;
        }
        let response = await this.$axios.$get(`/feed/commitment`, {params: params});
        commit('SET_COMMITMENT', response.commitments);
        if (!page) {
            commit('SET_TIMESTAMP', response.timestamp);
        }
    }
};
