export const state = () => ({
    feed: [],
    harvestingEvents: [],
    page: 0,
    timestamp: Number.MAX_SAFE_INTEGER,
    loading: false,
    loadingNext: false,
    feedIsEmpty: false
});

const PAGE_SIZE = 20;

export const mutations = {
    SET_FEED(state, feed) {
        state.feed = feed;
        state.loadingNext = feed.length >= PAGE_SIZE;
    },
    ADD_TO_FEED(state, feed) {
        state.feed = state.feed.concat(feed);
        state.loadingNext = feed.length >= PAGE_SIZE;
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
    SET_FEED_IS_EMPTY(state, feedIsEmpty) {
        state.feedIsEmpty = feedIsEmpty;
    },
    UP_VOTE_ANSWER(state, answerId) {
        let upVoteAnswer = state.feed.find((element) => element.answerId === answerId);
        upVoteAnswer.numberOfUpVotes++;
        upVoteAnswer.isUpVotedByUser = true;
    },
    DOWN_VOTE_ANSWER(state, answerId) {
        let downVoteAnswer = state.feed.find((answer) => answer.answerId === answerId);
        downVoteAnswer.numberOfUpVotes--;
        downVoteAnswer.isUpVotedByUser = false;
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
        question.isWatchedByUser = true;
    },
    REMOVE_QUESTION_WATCH(state, questionId) {
        let question = state.feed.find(
            (element) => element.questionId === questionId && element.type === 'Question');
        question.numberOfWatches--;
        question.isWatchedByUser = false;
    },
    ADD_COMMITMENT_WATCH(state, commitmentId) {
        let commitment = state.feed.find(
            (element) => element.commitmentId === commitmentId && element.type === 'Commitment');
        commitment.numberOfWatches++;
        commitment.isWatchedByUser = true;
    },
    REMOVE_COMMITMENT_WATCH(state, commitmentId) {
        let commitment = state.feed.find(
            (element) => element.commitmentId === commitmentId && element.type === 'Commitment');
        commitment.numberOfWatches--;
        commitment.isWatchedByUser = false;
    },
    ADD_USER_TO_TRUST_CIRCLE(state, userId) {
        for (let element of state.feed) {
            if (element.user && element.user.userId === userId) {
                element.user.isTrustUser = true;
            }
            if (element.creator && element.creator.userId === userId) {
                element.creator.isTrustUser = true;
            }
        }
    },
    REMOVE_USER_TO_TRUST_CIRCLE(state, userId) {
        for (let element of state.feed) {
            if (element.user && element.user.userId === userId) {
                element.user.isTrustUser = false;
            }
            if (element.creator && element.creator.userId === userId) {
                element.creator.isTrustUser = false;
            }
        }
    },
    SET_HARVESTING_EVENTS(state, events) {
        state.harvestingEvents = events;
    },
};

const addSocialMediaInfoToResponse = function (feed) {
    if (feed.length > 2) {
        feed.splice(2, 0, {type: 'socialMediaInfo'});
    }
};

const getFeedRequest = async function (commit, isAuthenticated, params, selectedFeedName, commitCommand, $axios) {
    let response;
    if (isAuthenticated) {
        response = await $axios.$get(`/user/feed/${selectedFeedName}`, params);
    } else {
        response = await $axios.$get(`/feed/${selectedFeedName}`, params);
    }
    commit('SET_PAGE', params.params.page);
    if (params.params.page === 0) {
        addSocialMediaInfoToResponse(response.feed);
    }
    commit(commitCommand, response.feed);
    return response;
};

const loadingHarvestingEvents = async function ($axios, commit) {
    let harvestingEvents = await $axios.$get(`/harvesting/actualEvents`);
    commit('SET_HARVESTING_EVENTS', harvestingEvents.events);
};

export const actions = {
    async getFeed({commit, state, rootState, rootGetters}) {
        try {
            commit('SET_LOADING', true);
            let params = {params: {page: 0, guiLanguage: rootState.i18n.language, languages: rootState.i18n.languages}};
            params.params = Object.assign(params.params, rootGetters['feedFilter/getFilterParams']);
            let response = await getFeedRequest(commit, rootState.auth.userIsAuthenticated, params,
                rootState.feedFilter.selectedFeedName, 'SET_FEED', this.$axios);
            commit('SET_TIMESTAMP', response.timestamp);
            commit('SET_FEED_IS_EMPTY', response.feed.length === 0);
            if (state.harvestingEvents.length === 0) {
                await loadingHarvestingEvents(this.$axios, commit);
            }
        } finally {
            commit('SET_LOADING', false);
        }
    },
    async loadNextFeedElements({commit, state, rootState, rootGetters}) {
        let params = {
            params: {
                page: state.page + 1, guiLanguage: rootState.i18n.language, languages: rootState.i18n.languages
            }
        };
        params.params = Object.assign(params.params, rootGetters['feedFilter/getFilterParams']);
        await getFeedRequest(commit, rootState.auth.userIsAuthenticated, params, rootState.feedFilter.selectedFeedName,
            'ADD_TO_FEED', this.$axios);
    }
};
