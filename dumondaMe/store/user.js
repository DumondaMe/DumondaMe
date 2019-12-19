export const state = () => ({
    userId: null,
    userImage: '',
    pageViewCount: 0,
    infoState: 0,
    isHarvestingUser: false
});

export const mutations = {
    SET_USER_ID: function (state, userId) {
        state.userId = userId;
    },
    SET_PAGE_VIEW_COUNT: function (state, pageViewCount) {
        state.pageViewCount = pageViewCount;
    },
    INCREMENT_PAGE_VIEW_COUNT: function (state) {
        state.pageViewCount++;
    },
    SET_USER_IMAGE: function (state, userImage) {
        state.userImage = userImage;
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