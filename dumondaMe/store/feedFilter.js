export const state = () => ({
    selectedFeedName: 'question',
    filterActive: true,
    isExpanded: true,
    activityTypeFilter: 'selectAll',
    sortOrder: 'mostPopular',
    eventInterestedOnly: false,
    periodOfTimeFilter: 'anyTime',
    regionFilter: null,
    topicFilter: [],
    trustCircleFilter: 0
});

export const getters = {
    isSubFilterActive: state => {
        return state.topicFilter.length > 0;
    },
    getFilterParams: state => {
        let params = {};
        if (state.selectedFeedName === 'activity') {
            if (state.activityTypeFilter !== 'selectAll') {
                params.typeFilter = state.activityTypeFilter;
            }
        }
        if (state.selectedFeedName === 'question' || state.selectedFeedName === 'commitment') {
            params.order = state.sortOrder;
            if (params.order === 'mostPopular' && state.periodOfTimeFilter !== 'anyTime') {
                params.periodOfTime = state.periodOfTimeFilter;
            }
        }

        if (state.filterActive) {
            if (state.selectedFeedName === 'event') {
                if (state.eventInterestedOnly) {
                    params.interestedOnly = true;
                }
            }
            if (state.topicFilter.length > 0) {
                params.topics = state.topicFilter.map(topic => topic.id);
            }
            if (state.trustCircleFilter > 0 && state.selectedFeedName !== 'event') {
                params.trustCircle = state.trustCircleFilter
            }
        }
        return params;
    }
};

export const mutations = {
    SET_SELECTED_FEED(state, filter) {
        state.selectedFeedName = filter;
    },
    SET_ACTIVITY_TYPE_FILTER(state, filter) {
        state.activityTypeFilter = filter;
    },
    SET_REGION_FILTER(state, regionFilter) {
        state.regionFilter = regionFilter;
    },
    SET_TOPIC_FILTER(state, topicFilter) {
        state.topicFilter = topicFilter;
    },
    SET_FILTER_ACTIVE(state, filterActive) {
        state.filterActive = filterActive;
    },
    SET_FILTER_EXPANDED(state, isExpanded) {
        state.isExpanded = isExpanded;
    },
    INCREASE_TRUST_CIRCLE_FILTER(state) {
        if (state.trustCircleFilter < 4) {
            state.trustCircleFilter++;
        }
    },
    DECREASE_TRUST_CIRCLE_FILTER(state) {
        if (state.trustCircleFilter > 0) {
            state.trustCircleFilter--;
        }
    },
    DEACTIVATE_TRUST_CIRCLE_FILTER(state) {
        state.trustCircleFilter = 0;
    },
    SET_SORT_ORDER(state, sortOrder) {
        state.sortOrder = sortOrder;
    },
    SET_PERIOD_OF_TIME_FILTER(state, periodOfTimeFilter) {
        state.periodOfTimeFilter = periodOfTimeFilter;
    },
    SET_EVENT_INTERESTED_ONLY_FILTER(state, eventInterestedOnly) {
        state.eventInterestedOnly = eventInterestedOnly;
    },
    SET_FILTER_TO_PUBLIC_STATE(state) {
        if (state.selectedFeedName === 'activity') {
            state.selectedFeedName = 'question';
        }
        state.sortOrder = 'mostPopular';
        state.eventInterestedOnly = false;
        state.trustCircleFilter = 0;
    }
};


export const actions = {
    async getTopicInfos({rootState, state, commit}, topics) {
        if (typeof topics === 'string') {
            topics = [topics];
        }
        let response = await this.$axios.$get('/topic/info',
            {params: {topicIds: topics, language: rootState.i18n.language}});
        commit('SET_TOPIC_FILTER', response);
    }
};
