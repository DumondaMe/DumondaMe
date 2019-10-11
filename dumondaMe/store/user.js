export const state = () => ({
    userId: null,
    infoState: 0,
    isHarvestingUser: false
});

export const mutations = {
    SET_USER_ID: function (state, userId) {
        state.userId = userId;
    },
    SET_USER_INFO_STATE: function (state, infoState) {
        state.infoState = infoState;
    },
    SET_IS_HARVESTING_USER: function (state, isHarvestingUser) {
        state.isHarvestingUser = isHarvestingUser;
    }
};

export const actions = {

};