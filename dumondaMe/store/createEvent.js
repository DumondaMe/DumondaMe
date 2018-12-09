import getTime from 'date-fns/get_time'
import startOfTomorrow from 'date-fns/start_of_tomorrow'

const TEN_HOURS_IN_SECONDS = 36000;
const ELEVEN_HOURS_IN_SECONDS = 39600;

const getTimestamp = function (seconds) {
    return (getTime(startOfTomorrow()) / 1000) + seconds;
};

export const state = () => ({
    event: {
        title: '', description: '', location: '', region: '', startDate: getTimestamp(TEN_HOURS_IN_SECONDS),
        endDate: getTimestamp(ELEVEN_HOURS_IN_SECONDS), linkDescription: null
    }
});

export const mutations = {
    RESET: function (state) {
        state.event = {
            title: '', description: '', location: '', region: '', startDate: getTimestamp(TEN_HOURS_IN_SECONDS),
            endDate: getTimestamp(ELEVEN_HOURS_IN_SECONDS), linkDescription: null
        };
    },
    SET_EVENT: function (state, event) {
        state.event = event;
    },
    SET_REGION: function (state, region) {
        state.event.region = region;
    },
    SET_LOCATION: function (state, location) {
        state.event.location = location;
    }
};

export const getters = {
    getEventCopy: state => {
        return state.event;
    }
};

const getEventForUpload = function (event) {
    let eventForUpload = {
        title: event.title,
        location: event.location,
        regionId: event.region.id,
        startDate: event.startDate,
        endDate: event.endDate,
    };
    if (event.linkDescription && event.linkDescription.trim() !== '') {
        eventForUpload.linkDescription = event.linkDescription;
    }
    if (event.description && event.description.trim() !== '') {
        eventForUpload.description = event.description;
    }
    return eventForUpload;
};

export const actions = {
    async createEvent({state}, commitmentId) {
        let event = getEventForUpload(state.event);
        event.commitmentId = commitmentId;
        let response = await this.$axios.$post('/user/commitment/event', event);
        event.eventId = response.eventId;
        event.region = state.event.region;
        return event;
    }
};