export const state = () => ({
    showBackButton: false
});

export const mutations = {
    SHOW_BACK_BUTTON: function (state) {
        state.showBackButton = true;
    },
    HIDE_BACK_BUTTON: function (state) {
        state.showBackButton = false;
    }
};