export const state = () => ({
    mainFilter: 'question',
    activityTypeFilter: 'selectAll',
    questionOrderFilter: 'mostPopular',
    commitmentOrderFilter: 'mostPopular',
    eventInterestedOnly: false,
    periodOfTimeFilter: 'anyTime',
    regionFilter: null,
    topicFilter: [{id: 'allTopics'}],
    trustCircleFilter: 0
});

export const getters = {
    getFilterParams: state => {
        let params = {};
        if (state.mainFilter === 'activity') {
            if (state.activityTypeFilter !== 'selectAll') {
                params.typeFilter = state.activityTypeFilter;
            }
        }
        if (state.mainFilter === 'question') {
            params.order = state.questionOrderFilter;
            if (params.order === 'mostPopular' && state.periodOfTimeFilter !== 'anyTime') {
                params.periodOfTime = state.periodOfTimeFilter;
            }
        }
        if (state.mainFilter === 'commitment') {
            params.order = state.commitmentOrderFilter;
            if (params.order === 'mostPopular' && state.periodOfTimeFilter !== 'anyTime') {
                params.periodOfTime = state.periodOfTimeFilter;
            }
        }
        if (state.mainFilter === 'event') {
            if (state.eventInterestedOnly) {
                params.interestedOnly = true;
            }
        }
        if (state.regionFilter && state.regionFilter.id !== 'international' && state.mainFilter !== 'question') {
            params.regions = [state.regionFilter]
        }
        if (!(state.topicFilter.length === 1 && state.topicFilter[0].id === 'allTopics')) {
            params.topics = state.topicFilter.map(topic => topic.id);
        }
        if (state.trustCircleFilter > 0) {
            params.trustCircle = state.trustCircleFilter
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
    SET_QUESTION_ORDER_FILTER(state, questionOrder) {
        state.questionOrderFilter = questionOrder;
    },
    SET_COMMITMENT_ORDER_FILTER(state, questionOrder) {
        state.commitmentOrderFilter = questionOrder;
    },
    SET_PERIOD_OF_TIME_FILTER(state, periodOfTimeFilter) {
        state.periodOfTimeFilter = periodOfTimeFilter;
    },
    SET_EVENT_INTERESTED_ONLY_FILTER(state, eventInterestedOnly) {
        state.eventInterestedOnly = eventInterestedOnly;
    },
    SET_FILTER_TO_PUBLIC_STATE(state) {
        if (state.mainFilter === 'activity') {
            state.mainFilter = 'question';
        }
        if (state.questionOrderFilter !== 'mostPopular' && state.questionOrderFilter !== 'newest') {
            state.questionOrderFilter = 'mostPopular';
        }
        if (state.commitmentOrderFilter !== 'mostPopular' && state.commitmentOrderFilter !== 'newest') {
            state.commitmentOrderFilter = 'mostPopular';
        }
        state.eventInterestedOnly = false;
        state.trustCircleFilter = 0;
    }
};


export const actions = {};
