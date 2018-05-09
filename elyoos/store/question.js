import Vue from 'vue';

export const state = () => ({
    question: {
        question: null, description: null, descriptionHtml: null, lang: null, numberOfWatches: 0,
        numberOfAnswers: 0, userWatchesQuestion: false, answers: [], topics: [], regions: []
    },
    sortNotes: 'newest'
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
        for (let answer of state.question.answers) {
            Vue.set(answer, 'notes', []);
        }
    },
    SET_QUESTION_INFO(state, question) {
        state.question.question = question.question;
        state.question.description = question.description;
        state.question.descriptionHtml = question.descriptionHtml;
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
        state.question.answers.sort((a, b) => b.upVotes - a.upVotes);
        state.question.numberOfAnswers++;
    },
    ADD_ANSWER_NOTE(state, {answerId, note}) {
        let answer = state.question.answers.find((answer) => answer.answerId === answerId);
        answer.notes.unshift(note);
        answer.numberOfNotes++;
    },
    SET_ANSWER_NOTES(state, {answerId, notes}) {
        let answer = state.question.answers.find((answer) => answer.answerId === answerId);
        answer.notes = notes;
    },
    EDIT_ANSWER_NOTE(state, {answerId, noteId, text, textHtml}) {
        let answer = state.question.answers.find((answer) => answer.answerId === answerId);
        let editNote = answer.notes.find((note) => note.noteId === noteId);
        editNote.text = text;
        editNote.textHtml = textHtml;
    },
    UP_VOTE_ANSWER(state, answerId) {
        let upVoteAnswer = state.question.answers.find((answer) => answer.answerId === answerId);
        upVoteAnswer.upVotes++;
        upVoteAnswer.hasVoted = true;
    },
    UP_VOTE_NOTE_OF_ANSWER(state, {answerId, noteId}) {
        let answer = state.question.answers.find((answer) => answer.answerId === answerId);
        let upVotedNote = answer.notes.find((note) => note.noteId === noteId);
        upVotedNote.upVotes++;
        upVotedNote.hasVoted = true;
    },
    DOWN_VOTE_ANSWER(state, answerId) {
        let downVoteAnswer = state.question.answers.find((answer) => answer.answerId === answerId);
        downVoteAnswer.upVotes--;
        downVoteAnswer.hasVoted = false;
    },
    DOWN_VOTE_NOTE_OF_ANSWER(state, {answerId, noteId}) {
        let answer = state.question.answers.find((answer) => answer.answerId === answerId);
        let upVotedNote = answer.notes.find((note) => note.noteId === noteId);
        upVotedNote.upVotes--;
        upVotedNote.hasVoted = false;
    },
    TOGGLE_ANSWER_NOTE_SORT(state) {
        if(state.sortNotes === 'newest') {
            state.sortNotes = 'upVotes'
        } else {
            state.sortNotes = 'newest'
        }
    },
    DELETE_NOTE_OF_ANSWER(state, {answerId, noteId}) {
        let answer = state.question.answers.find((answer) => answer.answerId === answerId);
        let noteToDelete = answer.notes.findIndex((note) => note.noteId === noteId);
        answer.notes.splice(noteToDelete, 1);
        answer.numberOfNotes--;
    },
};

const addDefaultProperties = function (answer, type, response) {
    answer.answerId = response.answerId;
    answer.created = response.created;
    answer.creator = response.creator;
    answer.answerType = type;
    answer.isAdmin = true;
    answer.upVotes = 0;
    answer.numberOfNotes = 0;
    answer.notes = [];
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
        addDefaultProperties(youtubeData, 'Youtube', response);
        youtubeData.idOnYoutube = response.idOnYoutube;
        youtubeData.linkEmbed = `https://www.youtube.com/embed/${response.idOnYoutube}`;

        commit('ADD_ANSWER', youtubeData);
        return response.answerId;
    },
    async createLinkAnswer({commit, state}, linkData) {
        let response = await this.$axios.$post(`/user/question/answer/link/${state.question.questionId}`,
            linkData);
        addDefaultProperties(linkData, 'Link', response);
        linkData.pageType = linkData.type;
        linkData.imageUrl = response.imageUrl;
        commit('ADD_ANSWER', linkData);
        return response.answerId;
    },
    async createBookAnswer({commit, state}, bookData) {
        let response = await this.$axios.$post(`/user/question/answer/book/${state.question.questionId}`,
            bookData);
        addDefaultProperties(bookData, 'Book', response);
        bookData.imageUrl = response.imageUrl;
        commit('ADD_ANSWER', bookData);
        return response.answerId;
    },
    async createCommitmentAnswer({commit, state}, commitmentData) {
        let response = await this.$axios.$post(`/user/question/answer/commitment/${state.question.questionId}`,
            {commitmentId: commitmentData.commitmentId, description: commitmentData.description});
        addDefaultProperties(commitmentData, 'Commitment', response);
        commitmentData.commitmentSlug = response.slug;
        commitmentData.imageUrl = response.imageUrl;
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
    },
    async createAnswerNote({commit, state}, {answerId, text}) {
        let response = await this.$axios.$post(`/user/question/answer/note`, {answerId, text});
        commit('ADD_ANSWER_NOTE', {
            answerId, note: {
                noteId: response.noteId, text: text, textHtml: response.textHtml, isAdmin: true, upVotes: 0,
                created: response.created, creator: response.creator
            }
        });
    },
    async loadAnswerNote({commit, state}, answerId) {
        let response = await this.$axios.$get(`/question/answer/note`, {
            params: {answerId, page: 0, sort: state.sortNotes}
        });
        commit('SET_ANSWER_NOTES', {
            answerId, notes: response.notes
        });
    },
    async upVoteNoteOfAnswer({commit}, {answerId, noteId}) {
        await this.$axios.$post(`/user/question/answer/note/upVote`, {noteId});
        commit('UP_VOTE_NOTE_OF_ANSWER', {answerId, noteId});
    },
    async downVoteNoteOfAnswer({commit}, {answerId, noteId}) {
        await this.$axios.$delete(`/user/question/answer/note/upVote`, {params: {noteId}});
        commit('DOWN_VOTE_NOTE_OF_ANSWER', {answerId, noteId});
    },
    async deleteNoteOfAnswer({commit}, {answerId, noteId}) {
        await this.$axios.$delete(`/user/question/answer/note`, {params: {noteId}});
        commit('DELETE_NOTE_OF_ANSWER', {answerId, noteId});
    },
};
