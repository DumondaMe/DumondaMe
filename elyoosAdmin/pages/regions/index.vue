<template>
    <single-view>
        <div slot="content">
            <regions></regions>
        </div>
    </single-view>
</template>

<script>
    import SingleView from '~/components/layouts/SingleView';
    import Regions from '~/components/regions/Regions';

    export default {
        async fetch({error, store}) {
            if (store.state.auth.userIsAuthenticated) {
                try {
                    await store.dispatch(`regions/getRegions`);
                } catch (e) {
                    error({statusCode: e.statusCode})
                }
            }
        },
        components: {SingleView, Regions}
    }
</script>

<style lang="scss">

</style>