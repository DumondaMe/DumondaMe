import {dataURItoBlob} from '~/utils/files/fileReaderUtil.js';
import {putWithFile} from '~/utils/files/upload.js';
import {replaceProperties} from '~/utils/object/property.js';

export const state = () => ({
    commitment: {
        title: null, description: null, website: null, lang: null, numberOfWatches: 0, userWatchesCommitment: false,
        imageUrl: null, linkedWithQuestions: [], events: [], totalNumberOfEvents: 0, topics: [], regions: [],
        contributors: []
    },
    admins: [],
    adminsRequested: [],
    isUpComingEvents: true,
    eventPage: 1
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
    SET_ADMINS(state, admins) {
        state.admins = admins;
    },
    REMOVE_ADMIN(state, userId) {
        let indexOfAdmin = state.admins.findIndex((admin) => admin.userId === userId);
        state.admins.splice(indexOfAdmin, 1);
    },
    SET_ADMINS_REQUESTED(state, adminsRequested) {
        state.adminsRequested = adminsRequested;
    },
    ADD_ADMIN_REQUESTED(state, adminRequested) {
        state.adminsRequested.push(adminRequested);
    },
    SET_IS_UP_COMING_EVENTS(state, isUpComingEvents) {
        state.isUpComingEvents = isUpComingEvents;
    },
    SET_EVENTS_PAGE(state, eventPage) {
        state.eventPage = eventPage;
    },
    SET_EVENTS(state, events) {
        state.commitment.events = events;
    },
    ADD_EVENTS(state, events) {
        state.commitment.events = state.commitment.events.concat(events);
    },
    ADD_EVENT(state, event) {
        state.commitment.events.unshift(event);
    },
    EDIT_EVENT(state, event) {
        let eventToEdit = state.commitment.events.find((eventToFind) => eventToFind.eventId === event.eventId);
        replaceProperties(eventToEdit, event);
    },
    DELETE_EVENT(state, eventId) {
        let indexOfEvent = state.commitment.events.findIndex((event) => event.eventId === eventId);
        state.commitment.events.splice(indexOfEvent, 1);
        state.commitment.totalNumberOfEvents--;
    },
    SET_TOTAL_NUMBER_OF_EVENTS(state, totalNumberOfEvents) {
        state.commitment.totalNumberOfEvents = totalNumberOfEvents;
    },
    SET_TOPICS(state, topics) {
        state.commitment.topics = topics;
    },
    SET_REGIONS(state, regions) {
        state.commitment.regions = regions;
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
    UP_VOTE_ANSWER(state, commitmentAnswerId) {
        for (let question of state.commitment.linkedWithQuestions) {
            if (question.commitmentAnswerId === commitmentAnswerId) {
                question.upVotes++;
                return;
            }
        }
    },
    DOWN_VOTE_ANSWER(state, commitmentAnswerId) {
        for (let question of state.commitment.linkedWithQuestions) {
            if (question.commitmentAnswerId === commitmentAnswerId) {
                question.upVotes--;
                return;
            }
        }
    }
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

const getEditEvent = function (event) {
    let eventToEdit = {
        eventId: event.eventId,
        title: event.title,
        location: event.location,
        regionId: event.region.id,
        startDate: event.startDate,
        endDate: event.endDate
    };
    if (event.linkDescription && event.linkDescription.trim() !== '') {
        eventToEdit.linkDescription = event.linkDescription;
    }
    if (event.description && event.description.trim() !== '') {
        eventToEdit.description = event.description;
    }
    return eventToEdit;
};

export const actions = {
    async getCommitment({commit, state, rootState}, commitmentId) {
        let resp = await this.$axios.$get(`commitment`, {params: {commitmentId, language: rootState.i18n.language}});
        commit('SET_COMMITMENT', resp);
        commit('SET_ADMINS', []);
        commit('SET_ADMINS_REQUESTED', []);
        commit('SET_IS_UP_COMING_EVENTS', true);
    },
    async getAdmins({commit, state}) {
        let resp = await this.$axios.get('user/commitment/admin',
            {params: {commitmentId: state.commitment.commitmentId}, progress: false});
        commit('SET_ADMINS', resp.data.admin);
        commit('SET_ADMINS_REQUESTED', resp.data.adminRequested);
    },
    async addAdmin({commit, state}, userId) {
        await this.$axios.post('user/commitment/admin',
            {commitmentId: state.commitment.commitmentId, userId});
    },
    async removeAdmin({commit, state}, userId) {
        await this.$axios.$delete('user/commitment/admin',
            {params: {commitmentId: state.commitment.commitmentId, userId}});
        commit('REMOVE_ADMIN', userId);
    },
    async deleteCommitment({commit, state}, commitmentId) {
        await this.$axios.$delete(`user/commitment`, {params: {commitmentId}});
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
    },
    async getEvents({commit, state, rootState}, {commitmentId, isUpComingEvents}) {
        if (isUpComingEvents !== state.isUpComingEvents) {
            commit('SET_EVENTS_PAGE', 0);
            let events = await this.$axios.$get(`commitment/event`, {
                params: {
                    commitmentId, upComing: isUpComingEvents, page: state.eventPage,
                    language: rootState.i18n.language
                }
            });
            commit('SET_EVENTS', events.events);
            commit('SET_TOTAL_NUMBER_OF_EVENTS', events.totalNumberOfEvents);
            commit('SET_IS_UP_COMING_EVENTS', isUpComingEvents);
            commit('SET_EVENTS_PAGE', state.eventPage + 1);
        }
    },
    async getNextEvents({commit, state, rootState}, {commitmentId}) {
        let events = await this.$axios.$get(`commitment/event`, {
            params: {
                commitmentId, upComing: state.isUpComingEvents, page: state.eventPage,
                language: rootState.i18n.language
            }
        });
        commit('ADD_EVENTS', events.events);
        commit('SET_EVENTS_PAGE', state.eventPage + 1);
    },
    async deleteEvent({commit, state}, eventId) {
        await this.$axios.$delete(`user/commitment/event`, {params: {eventId}});
        commit('DELETE_EVENT', eventId);
    },
    async editEvent({commit, state}, event) {
        await this.$axios.$put(`user/commitment/event`, getEditEvent(event));
        commit('EDIT_EVENT', event);
    }
};
