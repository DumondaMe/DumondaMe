export const state = () => ({
    events: [],
    loading: false
});

export const mutations = {
    SET_HARVESTING_EVENTS(state, events) {
        state.events = events;
    },
    SET_LOADING(state, loading) {
        state.loading = loading;
    },
};


export const actions = {
    async getHarvestingEvents({commit}) {
        try {
            commit('SET_LOADING', true);
            let harvestingEvents = await this.$axios.$get(`/harvesting/actualEvents`);
            commit('SET_HARVESTING_EVENTS', harvestingEvents.events);
        } finally {
            commit('SET_LOADING', false);
        }
    }
};
