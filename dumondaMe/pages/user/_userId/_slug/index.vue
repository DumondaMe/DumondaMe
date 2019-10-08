<template>
    <div>
        <user-profile v-if="!isHarvestingUser"></user-profile>
    </div>
</template>

<script>
    import UserProfile from '~/components/userProfile/UserProfile.vue';

    export default {
        async fetch({params, store, error}) {
            try {
                await store.dispatch(`userProfile/getProfileOtherUser`, params.userId);
            } catch (e) {
                if (e && e.request && e.request.res && e.request.res.statusCode) {
                    error({statusCode: e.request.res.statusCode});
                } else if (e.message === 'Network Error') {
                    error({statusCode: 600});
                }
            }
            store.commit('toolbar/SHOW_BACK_BUTTON');
        },
        head() {
            return {
                title: this.$store.state.userProfile.user.forename,
            }
        },
        components: {UserProfile},
        computed: {
            isHarvestingUser() {
                return this.$store.state.userProfile.user.isHarvestingUser;
            }
        }
    }
</script>

<style lang="scss">

</style>