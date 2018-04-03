import {dataURItoBlob} from '~/utils/files/fileReaderUtil.js';
import {uploadFileToUrl} from '~/utils/files/upload.js';

export const state = () => ({
    commitment: {title: '', description: '', website: '', lang: 'de'},
    titleImage: null
});

export const mutations = {
    RESET: function (state) {
        state.commitment = {title: '', description: '', website: '', lang: 'de'};
    },
    SET_COMMITMENT: function (state, commitment) {
        state.commitment = commitment;
    },
    SET_TITLE_IMAGE: function (state, image) {
        state.titleImage = image;
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

export const actions = {
    async getWebsitePreview({commit}, link) {
        let commitment = await this.$axios.$get(`/commitment/websitePreview`, {params: {link}});
        commitment.website = link;
        commit('SET_COMMITMENT', commitment);
    },
    async createCommitment({state}) {
        let commitment = JSON.parse(JSON.stringify(state.commitment));
        if (commitment.website.trim() === '') {
            delete commitment.website;
        }
        if (state.titleImage) {
            let blob = dataURItoBlob(state.titleImage);
            return await uploadFileToUrl(this.$axios, blob, 'user/commitment', commitment);
        }
        return await this.$axios.$post('/user/commitment', commitment);
    }
};