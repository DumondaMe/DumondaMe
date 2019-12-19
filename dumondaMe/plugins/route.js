export default ({app, store}) => {
    app.router.afterEach((to, from) => {
        if (to.name !== 'register' && to.name !== 'login' && typeof from.name === 'string') {
            store.commit('user/INCREMENT_PAGE_VIEW_COUNT');
        }
    });
}