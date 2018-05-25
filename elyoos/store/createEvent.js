import moment from 'moment';

const getTimestamp = function (hour) {
    let nextDayDate = `${moment().add(1, 'day').format('YYYY-MM-DD')} ${hour}:00`;
    return moment(nextDayDate, 'YYYY-MM-DD HH:mm').unix();
};

export const state = () => ({
    event: {
        title: '', description: '', location: '', region: '', startDate: getTimestamp('10'),
        endDate: getTimestamp('11'), linkDescription: null
    },
    topics: []
});

export const mutations = {
    RESET: function (state) {
        state.event = {
            title: '', description: '', location: '', region: '', startDate: getTimestamp('10'),
            endDate: getTimestamp('11'), linkDescription: null
        };
        state.topics = [];
    },
    SET_EVENT: function (state, event) {
        state.event = event;
    },
    SET_REGION: function (state, region) {
        state.event.region = region;
    },
    SET_LOCATION: function (state, location) {
        state.event.location = location;
    },
    SET_TOPICS: function (state, topics) {
        state.topics = topics;
    }
};

export const getters = {
    getEventCopy: state => {
        return state.event;
    }
};

const getEventForUpload = function (event, topics) {
    let eventForUpload = {
        title: event.title,
        description: event.description,
        location: event.location,
        topics: topics,
        region: event.region,
        startDate: event.startDate,
        endDate: event.endDate,
    };
    if (event.linkDescription && event.linkDescription.trim() !== '') {
        eventForUpload.linkDescription = event.linkDescription;
    }
    return eventForUpload;
};

export const actions = {
    async createEvent({state}, commitmentId) {
        debugger
        let event = getEventForUpload(state.event, state.topics);
        event.commitmentId = commitmentId;
        return await this.$axios.$post('/user/commitment/event', event);
    }
};