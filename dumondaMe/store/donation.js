import de from "vuetify/lib/locale/de";

export const state = () => ({
    actualNumber: 0,
    goal: 0
});

export const mutations = {
    SET_ACTUAL_NUMBER: function (state, actualNumber) {
        state.actualNumber = parseInt(actualNumber, 10);
    },
    SET_GOAL: function (state, goal) {
        state.goal = parseInt(goal, 10);
    }
};

export const getters = {
    getDonationGoal: state => {
        return state.goal.toLocaleString('ch-DE', {useGrouping: true});
    },
    getDonationActualNumber: state => {
        return state.actualNumber.toLocaleString('ch-DE', {useGrouping: true});
    },
    getDonationActualState: state => {
        return (state.actualNumber * 100) / state.goal;
    }
};