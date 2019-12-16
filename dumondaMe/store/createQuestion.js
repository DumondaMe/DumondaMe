export const state = () => ({
    question: {question: '', description: '', lang: 'de', topics: []},
    hasAskedQuestion: null
});

export const mutations = {
    RESET: function (state) {
        state.question.question = '';
        state.question.description = '';
        state.question.lang = 'de';
        state.question.topics = [];
    },
    SET_QUESTION: function (state, question) {
        state.question = question;
    },
    SET_TOPICS: function (state, topics) {
        state.question.topics = topics;
    },
    SET_ASKED_QUESTION: function (state, askedQuestion) {
        state.hasAskedQuestion = askedQuestion;
    }
};

export const getters = {
    getQuestionCopy: state => {
        return JSON.parse(JSON.stringify(state.question));
    }
};

export const actions = {
    async createNewQuestion({state, dispatch, commit}) {
        let response = await this.$axios.$post('/user/question', state.question);
        commit('SET_ASKED_QUESTION', true);
        if (response.oneTimeNotificationCreated) {
            dispatch('notification/checkNotificationChanged', null, {root:true});
        }
        return response;
    },
    async getHasQuestionCreated({commit, state}) {
        if (state.hasAskedQuestion === null) {
            let response = await this.$axios.$get('/user/question/askedQuestion');
            commit('SET_ASKED_QUESTION', response.askedQuestion);
        }
    }
};