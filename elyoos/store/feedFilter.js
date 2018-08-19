export const state = () => ({
    mainFilter: 'question',
    activityTypeFilter: 'selectAll',
    regionFilter: {id: 'international', description: 'Alle Regionen'},
    topicFilter: [{id: 'allTopics'}]
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
        if (!(state.topicFilter.length === 1 && state.topicFilter[0].id === 'allTopics')) {
            params.topics = state.topicFilter.map(topic => topic.id);
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
    },
    SET_TOPIC_FILTER(state, topicFilter) {
        state.topicFilter = topicFilter;
    }
};


export const actions = {};
