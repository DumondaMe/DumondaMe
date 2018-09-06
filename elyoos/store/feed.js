export const state = () => ({
    feed: [],
    page: 0,
    timestamp: Number.MAX_SAFE_INTEGER,
    loading: false,
    loadingNext: false
});

const PAGE_SIZE = 20;

export const mutations = {
    SET_FEED(state, feed) {
        state.feed = feed;
        state.loadingNext = feed.length === PAGE_SIZE;
    },
    ADD_TO_FEED(state, feed) {
        state.feed = state.feed.concat(feed);
        state.loadingNext = feed.length === PAGE_SIZE;
    },
    SET_PAGE(state, page) {
        state.page = page;
    },
    SET_TIMESTAMP(state, timestamp) {
        state.timestamp = timestamp;
    },
    SET_LOADING(state, loading) {
        state.loading = loading;
    },
    UP_VOTE_ANSWER(state, answerId) {
        let upVoteAnswer = state.feed.find((element) => element.answerId === answerId);
        upVoteAnswer.numberOfUpVotes++;
    },
    DOWN_VOTE_ANSWER(state, answerId) {
        let downVoteAnswer = state.feed.find((answer) => answer.answerId === answerId);
        downVoteAnswer.numberOfUpVotes--;
    },
    REMOVE_ANSWER(state, answerId) {
        let answerToRemove = state.feed.findIndex((answer) => answer.answerId === answerId);
        if (answerToRemove > -1) {
            state.feed.splice(answerToRemove, 1);
        }
    },
    ADD_QUESTION_WATCH(state, questionId) {
        let question = state.feed.find(
            (element) => element.questionId === questionId && element.type === 'Question');
        question.numberOfWatches++;
    },
    REMOVE_QUESTION_WATCH(state, questionId) {
        let question = state.feed.find(
            (element) => element.questionId === questionId && element.type === 'Question');
        question.numberOfWatches--;
    },
};

const getFeedRequest = async function (commit, isAuthenticated, params, mainFilter, commitCommand, $axios) {
    let response;
    if (isAuthenticated) {
        response = await $axios.$get(`/user/feed/${mainFilter}`, params);
    } else {
        response = await $axios.$get(`/feed/${mainFilter}`, params);
    }
    commit('SET_PAGE', params.params.page);
    commit(commitCommand, response.feed);
    return response;
};

export const actions = {
    async getFeed({commit, rootState, rootGetters}) {
        try {
            commit('SET_LOADING', true);
            let params = {params: {page: 0, guiLanguage: rootState.i18n.language, languages: ['de', 'en']}};
            params.params = Object.assign(params.params, rootGetters['feedFilter/getFilterParams']);
            let response = await getFeedRequest(commit, rootState.auth.userIsAuthenticated, params,
                rootState.feedFilter.mainFilter, 'SET_FEED', this.$axios);
            commit('SET_TIMESTAMP', response.timestamp);
        } finally {
            commit('SET_LOADING', false);
        }
    },
    async loadNextFeedElements({commit, state, rootState, rootGetters}) {
        let params = {params: {page: state.page + 1, guiLanguage: rootState.i18n.language, languages: ['de', 'en']}};
        params.params = Object.assign(params.params, rootGetters['feedFilter/getFilterParams']);
        await getFeedRequest(commit, rootState.auth.userIsAuthenticated, params, rootState.feedFilter.mainFilter,
            'ADD_TO_FEED', this.$axios);
    }
};
