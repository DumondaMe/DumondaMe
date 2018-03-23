export const state = () => ({
    commitment: {title: '', description: '', website: '', language: 'de'}
});

export const mutations = {
    RESET: function (state) {
        state.commitment = {title: '', description: '', website: '', language: 'de'};
    },
    SET_COMMITMENT: function (state, commitment) {
        state.commitment = commitment;
    },
    SET_TITLE_IMAGE: function (state, image) {
        state.commitment.image = image;
    },
    SET_TOPICS: function (state, topics) {
        state.commitment.topics = topics;
    }
};

export const getters = {
    getCommitmentCopy: state => {
        return JSON.parse(JSON.stringify(state.commitment));
    }
};

export const actions = {
    async getWebsitePreview({commit}, link) {
        let commitment = await this.$axios.$get(`/commitment/websitePreview`, {params: {link}});
        commitment.website = link;
        commit('SET_COMMITMENT', commitment);
    }
};