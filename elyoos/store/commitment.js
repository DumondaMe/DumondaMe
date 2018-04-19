import {dataURItoBlob} from '~/utils/files/fileReaderUtil.js';
import {putWithFile} from '~/utils/files/upload.js';

export const state = () => ({
    commitment: {
        title: null, description: null, website: null, lang: null, numberOfWatches: 0, userWatchesCommitment: false,
        imageUrl: null, linkedWithQuestions: []
    }
});

export const getters = {
    getCommitment: state => {
        return state.commitment;
    }
};

export const mutations = {
    SET_COMMITMENT(state, commitment) {
        state.commitment = commitment;
    },
    SET_TOPICS(state, topics) {
        state.commitment.topics = topics;
    },
    ADD_QUESTION(state, question) {
        state.commitment.linkedWithQuestions.unshift(question);
    },
    SET_WATCH(state) {
        state.commitment.userWatchesCommitment = true;
        state.commitment.numberOfWatches++;
    },
    REMOVE_WATCH(state) {
        state.commitment.userWatchesCommitment = false;
        state.commitment.numberOfWatches--;
    },
};

const getCommitmentForUpload = function (commitment) {
    let commitmentForUpload = {
        title: commitment.title,
        description: commitment.description,
        lang: commitment.lang
    };
    if (commitment.website && commitment.website.trim() !== '') {
        commitmentForUpload.website = commitment.website;
    }
    return commitmentForUpload;
};

export const actions = {
    async getCommitment({commit, state}, commitmentId) {
        let resp = await this.$axios.$get(`commitment`, {params: {commitmentId}});
        commit('SET_COMMITMENT', resp);
    },
    async updateCommitment({commit, state}, {commitment, commitmentId, imageHasChanged}) {
        let commitmentToUpload = getCommitmentForUpload(commitment, imageHasChanged);
        if (imageHasChanged && commitment.imageUrl) {
            let blob = dataURItoBlob(commitment.imageUrl);
            await putWithFile(this.$axios, blob, `user/commitment/${commitmentId}`, commitmentToUpload);
        } else {
            commitmentToUpload.resetImage = (imageHasChanged && !commitment.imageUrl);
            await this.$axios.$put(`/user/commitment/${commitmentId}`, commitmentToUpload);
        }
        commit('SET_COMMITMENT', commitment);
    }
};
