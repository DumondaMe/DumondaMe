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
    async createTextAnswer({commit, state}, {answer}) {
        let response = await this.$axios.$post(`/user/question/answer/text/${state.question.questionId}`, {answer});
        commit('ADD_TEXT_ANSWER', {
            answer, created: response.created, creator: response.creator
        });
    }
};
