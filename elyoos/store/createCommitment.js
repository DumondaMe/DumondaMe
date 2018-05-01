import {dataURItoBlob} from '~/utils/files/fileReaderUtil.js';
import {postWithFile} from '~/utils/files/upload.js';

export const state = () => ({
    commitment: {title: '', description: '', website: '', lang: 'de', imageUrl: null}
});

export const mutations = {
    RESET: function (state) {
        state.commitment = {title: '', description: '', website: '', lang: 'de', imageUrl: null};
    },
    SET_COMMITMENT: function (state, commitment) {
        state.commitment = commitment;
    },
    SET_REGIONS: function (state, regions) {
        state.commitment.regions = regions;
    },
    SET_TOPICS: function (state, topics) {
        state.commitment.topics = topics;
    }
};

export const getters = {
    getCommitmentCopy: state => {
        return JSON.parse(JSON.stringify(state.commitment));
    }
};

const getCommitmentForUpload = function (commitment) {
    let commitmentForUpload = {
        title: commitment.title,
        description: commitment.description,
        lang: commitment.lang,
        topics: commitment.topics,
        regions: commitment.regions,
    };
    if (commitment.website && commitment.website.trim() !== '') {
        commitmentForUpload.website = commitment.website;
    }
    return commitmentForUpload;
};

export const actions = {
    async getWebsitePreview({commit}, link) {
        let commitment = await this.$axios.$get(`/commitment/websitePreview`, {params: {link}});
        if (!commitment.error) {
            commitment.website = commitment.link;
            commit('SET_COMMITMENT', commitment);
            return true;
        }
        commit('RESET', commitment);
        return false;
    },
    async createCommitment({state}) {
        let commitment = getCommitmentForUpload(state.commitment);
        if (state.commitment.imageUrl) {
            let blob = dataURItoBlob(state.commitment.imageUrl);
            return await postWithFile(this.$axios, blob, 'user/commitment', commitment);
        }
        return await this.$axios.$post('/user/commitment', commitment);
    }
};