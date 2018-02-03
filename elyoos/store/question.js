export const state = () => ({
    question: null
});

export const mutations = {
    SET_QUESTION(state, question) {
        state.question = question;
    },
    ADD_ANSWER(state, answer) {
        state.question.answers.push(answer);
    }
};

export const actions = {
    async createTextAnswer({commit, state}, {answer}) {
        let response = await this.$axios.$post(`/user/question/answer/text/${state.question.questionId}`, {answer});
        commit('ADD_ANSWER', {
            answerId: response.answerId,
            answerType: 'Text', answer, created: response.created, creator: response.creator
        });
    },
    async createYoutubeAnswer({commit, state}, youtubeData) {
        let response = await this.$axios.$post(`/user/question/answer/youtube/${state.question.questionId}`,
            youtubeData);
        youtubeData.answerId = response.answerId;
        youtubeData.answerType = 'Youtube';
        youtubeData.created = response.created;
        youtubeData.creator = response.creator;
        commit('ADD_ANSWER', youtubeData);
    }
};
