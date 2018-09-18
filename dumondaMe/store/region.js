export const state = () => ({
    regions: []
});

export const mutations = {
    SET_REGIONS(state, regions) {
        state.regions = regions;
    }
};

export const actions = {
    async getRegions({commit, state, rootState}) {
        if (state.regions.length === 0) {
            let regions = await this.$axios.$get(`/region`, {params: {language: rootState.i18n.language}});
            commit('SET_REGIONS', regions);
        }
    }
};
