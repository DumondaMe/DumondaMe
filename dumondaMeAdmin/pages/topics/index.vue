<template>
    <single-view>
        <div slot="content">
            <topics></topics>
        </div>
    </single-view>
</template>

<script>
    import SingleView from '~/components/layouts/SingleView';
    import Topics from '~/components/topics/Topics';

    export default {
        async fetch({error, store}) {
            if (store.state.auth.userIsAuthenticated) {
                try {
                    await store.dispatch(`topics/getTopics`);
                } catch (e) {
                    error({statusCode: e.statusCode})
                }
            }
        },
        components: {SingleView, Topics}
    }
</script>

<style lang="scss">

</style>