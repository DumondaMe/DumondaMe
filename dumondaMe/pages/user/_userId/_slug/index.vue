<template>
    <user-profile></user-profile>
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
                } else {
                    error();
                }
            }
            store.commit('toolbar/SHOW_BACK_BUTTON');
        },
        head() {
            return {
                title: this.$store.state.userProfile.user.forename,
            }
        },
        mounted() {
            if (this.$store.state.userProfile.user.isHarvestingUser && this.$route.name === 'user-userId-slug') {
                this.$router.replace({
                    name: 'dumondaMeOnTour-userId',
                    params: {userId: this.$store.state.userProfile.user.userId}
                });
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