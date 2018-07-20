<template>
    <single-view>
        <div slot="content">
            <login v-if="!isAuthenticated"></login>
            <div v-else>
                <registered-users></registered-users>
                <topic-suggestion></topic-suggestion>
                <news></news>
            </div>
        </div>
    </single-view>
</template>

<script>
    import SingleView from '~/components/layouts/SingleView';
    import Login from '~/components/login/Login';
    import RegisteredUsers from '~/components/home/RegisteredUsers';
    import TopicSuggestion from '~/components/home/TopicSuggestion';
    import News from '~/components/home/News';

    export default {
        async fetch({error, store}) {
            if (store.state.auth.userIsAuthenticated) {
                try {
                    await store.dispatch(`home/getHome`);
                } catch (e) {
                    error({statusCode: e.statusCode})
                }
            }
        },
        components: {Login, SingleView, RegisteredUsers, TopicSuggestion, News},
        computed: {
            isAuthenticated() {
                return this.$store.state.auth.userIsAuthenticated
            }
        }
    }
</script>

<style lang="scss">

</style>