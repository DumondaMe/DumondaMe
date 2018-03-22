export const state = () => ({
    commitment: {title: '', description: '', website: '', language: 'de'}
});

export const mutations = {
    SET_COMMITMENT: function (state, commitment) {
        state.commitment = commitment;
    },
    SET_TITLE_IMAGE: function (state, image) {
        state.commitment.image = image;
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