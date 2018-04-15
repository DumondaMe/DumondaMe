export const state = () => ({
    notifications: [],
    numberOfUnreadNotifications: 0
});

export const getters = {
    numberOfUnreadNotifications: state => {
        return state.numberOfUnreadNotifications;
    },
    notifications: state => {
        return state.notifications;
    }
};

export const mutations = {
    RESET_NOTIFICATION: function (state) {
        state.notifications = [];
        state.numberOfUnreadNotifications = 0;
    },
    SET_NOTIFICATION: function (state, notification) {
        state.notifications = notification.notifications;
        state.numberOfUnreadNotifications = notification.numberOfUnreadNotifications;
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