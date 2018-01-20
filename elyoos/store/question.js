export const state = () => ({
    question: null
});

export const mutations = {
    SET_QUESTION(state, question) {
        state.question = question;
    },
    ADD_TEXT_ANSWER(state, textAnswer) {
        state.question.textAnswers.push(textAnswer);
    }
};

export const actions = {
    async createTextAnswer({commit, state}, {title, description}) {
        let response = await this.$axios.$post(`/user/question/answer/text/${state.question.questionId}`,
            {title, description});
        commit('ADD_TEXT_ANSWER', {
            title, description, created: response.created, creator: response.creator
        });
    }
};
