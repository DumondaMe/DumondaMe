export const state = () => ({
    question: {
        question: null, description: null, lang: null, numberOfWatches: 0, userWatchesQuestion: false,
        answers: [], topics: [], regions: []
    }
});

export const getters = {
    getQuestionInfo: state => {
        return JSON.parse(JSON.stringify({
            question: state.question.question,
            description: state.question.description,
            lang: state.question.language,
        }));
    }
};

export const mutations = {
    SET_QUESTION(state, question) {
        state.question = question;
    },
    SET_QUESTION_INFO(state, question) {
        state.question.question = question.question;
        state.question.description = question.description;
        state.question.language = question.lang;
    },
    SET_TOPICS(state, topics) {
        state.question.topics = topics;
    },
    SET_WATCH(state) {
        state.question.userWatchesQuestion = true;
        state.question.numberOfWatches++;
    },
    REMOVE_WATCH(state) {
        state.question.userWatchesQuestion = false;
        state.question.numberOfWatches--;
    },
    ADD_ANSWER(state, answer) {
        answer.newAddedAnswer = true;
        state.question.answers.unshift(answer);
        state.question.answers.sort((a, b) => b.upVotes - a.upVotes)
    },
    UP_VOTE_ANSWER(state, answerId) {
        let upVoteAnswer = state.question.answers.find((answer) => answer.answerId === answerId);
        upVoteAnswer.upVotes++;
        upVoteAnswer.hasVoted = true;
    },
    DOWN_VOTE_ANSWER(state, answerId) {
        let downVoteAnswer = state.question.answers.find((answer) => answer.answerId === answerId);
        downVoteAnswer.upVotes--;
        downVoteAnswer.hasVoted = false;
    }
};

export const actions = {
    async deleteQuestion({commit, state}) {
        await this.$axios.$delete(`/user/question`, {params: {questionId: state.question.questionId}});
    },
    async upVoteAnswer({commit, state}, answerId) {
        await this.$axios.$post(`/user/question/answer/upVote/${answerId}`);
        commit('UP_VOTE_ANSWER', answerId);
    },
    async downVoteAnswer({commit, state}, answerId) {
        await this.$axios.$delete(`/user/question/answer/upVote/${answerId}`);
        commit('DOWN_VOTE_ANSWER', answerId);
    },
    async createTextAnswer({commit, state}, {answer}) {
        let response = await this.$axios.$post(`/user/question/answer/text/${state.question.questionId}`, {answer});
        commit('ADD_ANSWER', {
            answerId: response.answerId, isAdmin: true, upVotes: 0,
            answerType: 'Text', answer, created: response.created, creator: response.creator
        });
        return response.answerId;
    },
    async createYoutubeAnswer({commit, state}, youtubeData) {
        let response = await this.$axios.$post(`/user/question/answer/youtube/${state.question.questionId}`,
            youtubeData);
        youtubeData.answerId = response.answerId;
        youtubeData.answerType = 'Youtube';
        youtubeData.isAdmin = true;
        youtubeData.upVotes = 0;
        youtubeData.idOnYoutube = response.idOnYoutube;
        youtubeData.linkEmbed = `https://www.youtube.com/embed/${response.idOnYoutube}`;
        youtubeData.created = response.created;
        youtubeData.creator = response.creator;
        commit('ADD_ANSWER', youtubeData);
        return response.answerId;
    },
    async createLinkAnswer({commit, state}, linkData) {
        let response = await this.$axios.$post(`/user/question/answer/link/${state.question.questionId}`,
            linkData);
        linkData.answerId = response.answerId;
        linkData.answerType = 'Link';
        linkData.pageType = linkData.type;
        linkData.isAdmin = true;
        linkData.upVotes = 0;
        linkData.created = response.created;
        linkData.imageUrl = response.imageUrl;
        linkData.creator = response.creator;
        commit('ADD_ANSWER', linkData);
        return response.answerId;
    },
    async createBookAnswer({commit, state}, bookData) {
        let response = await this.$axios.$post(`/user/question/answer/book/${state.question.questionId}`,
            bookData);
        bookData.answerId = response.answerId;
        bookData.answerType = 'Book';
        bookData.isAdmin = true;
        bookData.upVotes = 0;
        bookData.created = response.created;
        bookData.imageUrl = response.imageUrl;
        bookData.creator = response.creator;
        commit('ADD_ANSWER', bookData);
        return response.answerId;
    },
    async createCommitmentAnswer({commit, state}, commitmentData) {
        let response = await this.$axios.$post(`/user/question/answer/commitment/${state.question.questionId}`,
            {commitmentId: commitmentData.commitmentId, description: commitmentData.description});
        commitmentData.answerId = response.answerId;
        commitmentData.commitmentSlug = response.slug;
        commitmentData.answerType = 'Commitment';
        commitmentData.isAdmin = true;
        commitmentData.upVotes = 0;
        commitmentData.created = response.created;
        commitmentData.imageUrl = response.imageUrl;
        commitmentData.creator = response.creator;
        commit('ADD_ANSWER', commitmentData);
        if (response.creator && response.creator.isAdminOfCommitment) {
            commit('notification/ADD_NOTIFICATION', {
                type: 'showQuestionRequest', created: response.created, commitmentId: commitmentData.commitmentId,
                commitmentTitle: commitmentData.title, commitmentSlug: commitmentData.commitmentSlug,
                questionId: state.question.questionId, question: state.question.question,
                questionSlug: commitmentData.questionSlug, removed: false
            }, {root: true});
        }
        return response.answerId;
    }
};
