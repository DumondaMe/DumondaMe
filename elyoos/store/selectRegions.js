export const state = () => ({
    regions: []
});

const setSubRegionSelected = function (region) {
    if (region.subRegions.find((subRegion) => subRegion.isSelected === true ||
            subRegion.subRegionIsSelected === true)) {
        region.subRegionIsSelected = true;
        region.isSelected = false;
    } else {
        region.subRegionIsSelected = false;
        region.isSelected = true;
    }
};

const disableSubRegions = function (subRegions) {
    for (let subRegion of subRegions) {
        subRegion.isSelected = false;
        subRegion.subRegionIsSelected = false;
        disableSubRegions(subRegion.subRegions);
    }
};

const changeSelectOfRegion = function (regions, selectedRegion) {
    for (let region of regions) {
        if (region.code === selectedRegion) {
            region.isSelected = !region.isSelected;
            if (!region.isSelected) {
                region.subRegionIsSelected = false;
            }
            disableSubRegions(region.subRegions);
            return true;
        } else if (region.subRegions.length > 0) {
            if (changeSelectOfRegion(region.subRegions, selectedRegion)) {
                setSubRegionSelected(region);
                return true;
            }
        }
    }
    return false;
};

export const mutations = {
    RESET: function (state) {
        state.regions = [];
    },
    SET_REGIONS: function (state, regions) {
        state.regions = regions;
    },
    SELECT_CHANGED: function (state, selectedRegion) {
        if (selectedRegion.code === 'international') {
            disableSubRegions(state.regions);
            let international = state.regions.find((topRegion) => topRegion.code === 'international');
            international.isSelected = true;
        } else {
            state.regions.find((topRegion) => topRegion.code === 'international').isSelected = false;
            changeSelectOfRegion(state.regions, selectedRegion.code);
        }
    }
};

const getSelectedRegions = function (regions) {
    let selectedRegion = [];
    for (let region of regions) {
        if (region.isSelected) {
            selectedRegion.push(region.code);
        }
        selectedRegion = selectedRegion.concat(getSelectedRegions(region.subRegions));
    }
    return selectedRegion;
};

export const getters = {
    getRegions: state => {
        return state.regions;
    },
    getSelected: state => {
        return getSelectedRegions(state.regions);
    }
};

const setAllProperties = function (regions) {
    for (let region of regions) {
        region.isSelected = false;
        region.subRegionIsSelected = false;
        setAllProperties(region.subRegions);
    }
};

export const actions = {
    async getRegions({commit}) {
        commit('RESET');
        let region = await this.$axios.$get(`/region`);
        setAllProperties(region.regions);
        commit('SET_REGIONS', region.regions);
    }
};