<template>
    <single-view>
        <div slot="content">
            <login v-if="!isAuthenticated"></login>
            <div v-else>Du bist eingelogt</div>
        </div>
    </single-view>
</template>

<script>
    import SingleView from '~/components/layouts/SingleView';
    import Login from '~/components/login/Login';

    export default {
        async fetch({query, app, error, store}) {
            if (store.state.auth.userIsAuthenticated) {
                try {

                } catch (e) {
                    error({statusCode: e.statusCode})
                }
            }
        },
        components: {Login, SingleView},
        computed: {
            isAuthenticated() {
                return this.$store.state.auth.userIsAuthenticated
            }
        }
    }
</script>

<style lang="scss">

</style>