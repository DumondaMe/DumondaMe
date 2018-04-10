import {dataURItoBlob} from '~/utils/files/fileReaderUtil.js';
import {putWithFile} from '~/utils/files/upload.js';

export const state = () => ({
    commitment: {title: null, description: null, website: null, lang: null, imageUrl: null}
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
    async getCommitment({commit, state}, answerId) {
        let resp = await this.$axios.$get(`commitment`, {params: {answerId}});
        commit('SET_COMMITMENT', resp);
    },
    async updateCommitment({commit, state}, {commitment, answerId, imageHasChanged}) {
        let commitmentToUpload = getCommitmentForUpload(commitment, imageHasChanged);
        if (imageHasChanged && commitment.imageUrl) {
            let blob = dataURItoBlob(commitment.imageUrl);
            await putWithFile(this.$axios, blob, `user/commitment/${answerId}`, commitmentToUpload);
        } else {
            commitmentToUpload.resetImage = (imageHasChanged && !commitment.imageUrl);
            await this.$axios.$put(`/user/commitment/${answerId}`, commitmentToUpload);
        }
        commit('SET_COMMITMENT', commitment);
    }
};
