<template>
    <user-profile></user-profile>
</template>

<script>
    import UserProfile from '~/components/userProfile/UserProfile.vue';

    export default {
        async fetch({store, error}) {
            try {
                await store.dispatch(`userProfile/getProfile`);
            } catch (e) {
                if (e && e.request && e.request.res && e.request.res.statusCode) {
                    error({statusCode: e.request.res.statusCode});
                } else if (e.message === 'Network Error') {
                    error({statusCode: 600});
                }
            }
            store.commit('toolbar/HIDE_BACK_BUTTON');
        },
        components: {
            UserProfile
        }
    }
</script>

<style lang="scss">

</style>