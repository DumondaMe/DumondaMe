import Vue from 'vue';

export const state = () => ({
    notifications: [],
    numberOfUnreadNotifications: 0,
    challengeStatus: {},
    hasMoreNotifications: false
});

export const getters = {
    numberOfUnreadNotifications: state => {
        return state.numberOfUnreadNotifications;
    },
    notifications: state => {
        return state.notifications;
    }
};

const setNotificationAsRead = function (state, notificationSetAsRead, propertyValue, propertyName) {
    let index = state.notifications.indexOf(notificationSetAsRead);
    if (index > -1) {
        Vue.set(state.notifications[index], 'read', true);
        if (propertyName) {
            Vue.set(state.notifications[index], propertyName, propertyValue);
        }
    }
    state.numberOfUnreadNotifications--;
};

export const mutations = {
    RESET_NOTIFICATION: function (state) {
        state.notifications = [];
        state.numberOfUnreadNotifications = 0;
        state.hasMoreNotifications = false
    },
    ALL_READ: function (state) {
        state.numberOfUnreadNotifications = 0;
    },
    SET_NOTIFICATION: function (state, notification) {
        state.notifications = state.notifications.concat(notification.notifications);
        state.numberOfUnreadNotifications = notification.numberOfUnreadNotifications;
        for (let prop in notification.challengeStatus) {
            if (notification.challengeStatus.hasOwnProperty(prop)) {
                Vue.set(state.challengeStatus, prop, notification.challengeStatus[prop]);
            }
        }
        state.challengeStatus = notification.challengeStatus;
        state.hasMoreNotifications = notification.hasMoreNotifications;
    },
    SET_NUMBER_OF_UNREAD_NOTIFICATIONS: function (state, numberOfUnreadNotifications) {
        state.numberOfUnreadNotifications = numberOfUnreadNotifications;
    },
    SHOW_QUESTION: function (state, {notificationSetAsRead, showQuestion}) {
        setNotificationAsRead(state, notificationSetAsRead, showQuestion, 'showQuestion');
    },
    ADMIN_OF_COMMITMENT: function (state, {notificationSetAsRead, confirmToBeAdmin}) {
        setNotificationAsRead(state, notificationSetAsRead, confirmToBeAdmin, 'confirmToBeAdmin');
    },
    ADD_NOTIFICATION: function (state, notificationToAdd) {
        state.notifications.unshift(notificationToAdd);
        state.numberOfUnreadNotifications++;
    }
};

let checkNotificationTimer;

const checkNotificationChanged = async function (axios, commit) {
    try {
        let status = await axios.$get('user/notification/status', {progress: false});
        commit('SET_NUMBER_OF_UNREAD_NOTIFICATIONS', status.numberOfUnreadNotifications);
    } catch (error) {
        console.log(error);
    }
};

export const actions = {
    async getNotifications({commit, state}) {
        let notifications = await this.$axios.$get('user/notification',
            {params: {skip: state.notifications.length, limit: 20}});
        commit('SET_NOTIFICATION', notifications);
    },
    async checkNotificationChanged({commit}) {
        await checkNotificationChanged(this.$axios, commit);
    },
    async startCheckNotificationChanged({commit}) {
        if (!checkNotificationTimer) {
            await checkNotificationChanged(this.$axios, commit);
            checkNotificationTimer = setInterval(checkNotificationChanged, 120000, this.$axios, commit);
        }
    },
    stopCheckNotificationChanged() {
        if (checkNotificationTimer) {
            clearInterval(checkNotificationTimer);
            checkNotificationTimer = null;
        }
    }
};