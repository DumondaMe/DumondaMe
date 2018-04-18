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

export const actions = {
    async getNotifications({commit}) {
        try {
            let notifications = await this.$axios.$get('user/notification');
            commit('SET_NOTIFICATION', notifications);
        } catch (error) {
            console.log(error);
        }
    }
};