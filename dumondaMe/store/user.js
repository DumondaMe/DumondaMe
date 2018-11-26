export const state = () => ({
    userId: null,
    infoState: 0
});

export const mutations = {
    SET_USER_ID: function (state, userId) {
        state.userId = userId;
    },
    SET_USER_INFO_STATE: function (state, infoState) {
        state.infoState = infoState;
    }
};

export const actions = {

};