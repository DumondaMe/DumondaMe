export const state = () => ({
    commitment: null
});

export const getters = {
    getCommitment: state => {
        return JSON.parse(JSON.stringify(state.commitment));
    }
};

export const mutations = {
    SET_COMMITMENT(state, commitment) {
        state.commitment = commitment;
    },
    SET_TOPICS(state, topics) {
        state.commitment.topics = topics;
    },
};

export const actions = {
    async getCommitment({commit, state}, answerId) {
        let resp = await this.$axios.$get(`commitment`, {params: {answerId}});
        commit('SET_COMMITMENT', resp);
    }
};
