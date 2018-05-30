export const state = () => ({
    regions: [],
    selectedRegion: null
});

const setSelectedRegion = function (regions, selectedRegion) {
    for (let region of regions) {
        if (region.code === selectedRegion) {
            region.isSelected = true;
            return region;
        } else if (region.subRegions.length > 0) {
            let subRegionSelected = setSelectedRegion(region.subRegions, selectedRegion);
            if (subRegionSelected) {
                region.subRegionIsSelected = true;
                return subRegionSelected;
            }
        }
    }
    return null;
};

export const mutations = {
    RESET: function (state) {
        state.regions = [];
        state.selectedRegion = null;
    },
    SET_REGIONS: function (state, regions) {
        state.regions = regions;
    },
    SELECT_CHANGED: function (state, selectedRegion) {
        if (state.selectedRegion && state.selectedRegion.code === selectedRegion) {
            resetAllProperties(state.regions);
            state.selectedRegion = null;
        } else {
            resetAllProperties(state.regions);
            state.selectedRegion = setSelectedRegion(state.regions, selectedRegion);
        }
    }
};

export const getters = {
    getRegions: state => {
        return state.regions;
    },
    getSelectedRegion: state => {
        return state.selectedRegion;
    }
};

const resetAllProperties = function (regions) {
    for (let region of regions) {
        region.isSelected = false;
        region.subRegionIsSelected = false;
        resetAllProperties(region.subRegions);
    }
};

const removeInternational = function (regions) {
    let indexInternational = regions.findIndex(region => region.code === 'international');
    if (indexInternational > -1) {
        regions.splice(indexInternational, 1);
    }
};

export const actions = {
    async getRegions({commit}) {
        commit('RESET');
        let region = await this.$axios.$get(`/region`);
        resetAllProperties(region.regions);
        removeInternational(region.regions);
        commit('SET_REGIONS', region.regions);
    }
};