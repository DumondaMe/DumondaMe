export const state = () => ({
    mainFilter: 'question',
    activityTypeFilter: 'selectAll',
    regionFilter: {id: 'international', description: 'Alle Regionen'}
});

export const getters = {
    getFilterParams: state => {
        let params = {};
        if (state.mainFilter === 'activity') {
            if (state.activityTypeFilter !== 'selectAll') {
                params.typeFilter = state.activityTypeFilter;
            }
            if (state.regionFilter.id !== 'international') {
                params.regions = [state.regionFilter.id]
            }
        }
        return params;
    }
};

export const mutations = {
    SET_MAIN_FILTER(state, filter) {
        state.mainFilter = filter;
    },
    SET_ACTIVITY_TYPE_FILTER(state, filter) {
        state.activityTypeFilter = filter;
    },
    SET_REGION_FILTER(state, regionFilter) {
        state.regionFilter = regionFilter;
    }
};


export const actions = {};
