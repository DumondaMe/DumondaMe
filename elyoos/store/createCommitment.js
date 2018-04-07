import {dataURItoBlob} from '~/utils/files/fileReaderUtil.js';
import {uploadFileToUrl} from '~/utils/files/upload.js';

export const state = () => ({
    commitment: {title: '', description: '', website: '', lang: 'de'},
    titleImage: null
});

export const mutations = {
    RESET: function (state) {
        state.commitment = {title: '', description: '', website: '', lang: 'de'};
        state.titleImage = null;
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
        commitment.website = link;
        commit('SET_COMMITMENT', commitment);
    },
    async createCommitment({state}) {
        let commitment = getCommitmentForUpload(state.commitment);
        if (state.titleImage) {
            let blob = dataURItoBlob(state.titleImage);
            return await uploadFileToUrl(this.$axios, blob, 'user/commitment', commitment);
        }
        return await this.$axios.$post('/user/commitment', commitment);
    }
};