import Vue from 'vue';

export const state = () => ({
    regions: []
});

export const getters = {
    getTopRegions: (state, getters, rootState) => {
        let topRegions = [];
        for (let region of state.regions) {
            topRegions.push({regionId: region.regionId, description: region[rootState.i18n.language]});
        }
        return topRegions;
    }
};

const getRegion = function (regions, regionId) {
    for (let region of regions) {
        if (region.regionId === regionId) {
            return region;
        } else if (region.regions && region.regions.length > 0) {
            return getRegion(region.regions, regionId);
        }
    }
    return null;
};

export const mutations = {
    SET_REGIONS: function (state, regions) {
        state.regions = regions;
    },
    SET_SUB_REGIONS: function (state, {regions, regionId}) {
        let parentRegion = getRegion(state.regions, regionId);
        Vue.set(parentRegion, 'regions', regions);
    },
    ADD_REGION: function (state, region) {
        let parentRegions = getRegion(state.regions, region.parentRegionId);
        if (parentRegions && !parentRegions.regions) {
            Vue.set(parentRegions, 'regions', []);
        }
        region.numberOfSubRegions = 0;
        region.regions = [];
        if (!parentRegions) {
            state.regions.unshift(region);
        } else {
            parentRegions.regions.unshift(region);
            parentRegions.numberOfSubRegions++;
        }
    },
    EDIT_REGION: function (state, region) {
        let regionToEdit = getRegion(state.regions, region.regionId);
        if (regionToEdit.parentRegionId === region.parentRegionId) {
            regionToEdit.de = region.de;
            regionToEdit.en = region.en;
        }

    }
};

export const actions = {
    async getRegions({rootState, commit}) {
        let response = await this.$axios.$get('regions',
            {params: {language: rootState.i18n.language, parentRegionId: 'international'}});
        commit('SET_REGIONS', response.regions);
    },
    async getSubRegions({rootState, commit}, regionId) {
        let response = await this.$axios.$get('regions',
            {params: {language: rootState.i18n.language, parentRegionId: regionId}});
        commit('SET_SUB_REGIONS', {regions: response.regions, regionId});
    },
    async createRegion({commit}, {de, en, parentRegionId}) {
        let response = await this.$axios.$post('regions', {de, en, parentRegionId});
        commit('ADD_REGION', {de, en, regionId: response.regionId, parentRegionId});
    },
    async editRegion({commit}, {de, en, parentRegionId, regionId}) {
        await this.$axios.$put('regions', {de, en, parentRegionId, regionId});
        commit('EDIT_REGION', {de, en, parentRegionId, regionId});
    }
};