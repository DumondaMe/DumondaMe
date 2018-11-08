export const state = () => ({
    notifications: [],
    numberOfNotifications: 0
});

export const getters = {
    numberOfNotifications: state => {
        return state.numberOfNotifications;
    },
    notifications: state => {
        return state.notifications;
    }
};

export const mutations = {
    RESET_NOTIFICATION: function (state) {
        state.notifications = [];
        state.numberOfNotifications = 0;
    },
    SET_NOTIFICATION: function (state, notification) {
        for (let n of notification.notifications) {
            n.removed = false;
        }
        state.notifications = notification.notifications;
        state.numberOfNotifications = notification.numberOfNotifications;
    },
    SET_NUMBER_OF_NOTIFICATIONS: function (state, numberOfNotifications) {
        state.numberOfNotifications = numberOfNotifications;
    },
    REMOVE_NOTIFICATION: function (state, notificationToRemove) {
        let index = state.notifications.indexOf(notificationToRemove);
        if (index > -1) {
            state.notifications[index].removed = true;
        }
        state.numberOfNotifications--;
    },
    ADD_NOTIFICATION: function (state, notificationToAdd) {
        state.notifications.unshift(notificationToAdd);
        state.numberOfNotifications++;
    }
};

let checkNotificationTimer;

const checkNotificationChanged = async function (axios, commit) {
    try {
        let status = await axios.$get('user/notification/status', {progress: false});
        commit('SET_NUMBER_OF_NOTIFICATIONS', status.numberOfNotifications);
    } catch (error) {
        console.log(error);
    }
};

export const actions = {
    async getNotifications({commit}) {
        try {
            let notifications = await this.$axios.$get('user/notification');
            commit('SET_NOTIFICATION', notifications);
        } catch (error) {
            console.log(error);
        }
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
    },
    async notificationRead({commit}, notification) {
        await this.$axios.$put('user/notification/read',
            {notificationId: notification.notificationId});
        commit('REMOVE_NOTIFICATION', notification);
    }
};