import moment from 'moment';

const getTimestamp = function (hour) {
    let nextDayDate = `${moment().add(1, 'day').format('YYYY-MM-DD')} ${hour}:00`;
    return moment(nextDayDate, 'YYYY-MM-DD HH:mm').unix();
};

export const state = () => ({
    event: {
        title: '', description: '', location: '', region: '', startDate: getTimestamp('10'),
        endDate: getTimestamp('11'), linkDescription: null
    }
});

export const mutations = {
    RESET: function (state) {
        state.event = {
            title: '', description: '', location: '', region: '', startDate: getTimestamp('10'),
            endDate: getTimestamp('11'), linkDescription: null
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
        region: event.region,
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
        return await this.$axios.$post('/user/commitment/event', event);
    }
};