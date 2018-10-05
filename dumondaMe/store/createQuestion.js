export const state = () => ({
    question: {question: '', description: '', lang: 'de'}
});

export const mutations = {
    RESET: function (state) {
        state.question = {question: '', description: '', lang: 'de'};
    },
    SET_QUESTION: function (state, question) {
        state.question = question;
    },
    SET_TOPICS: function (state, topics) {
        state.question.topics = topics;
    }
};

export const getters = {
    getQuestionCopy: state => {
        return JSON.parse(JSON.stringify(state.question));
    }
};

export const actions = {
    async createNewQuestion({state}) {
        return await this.$axios.$post('/user/question', state.question);
    }
};