<template>
    <div id="ely-user-setting-layout">
        <settings></settings>
    </div>
</template>

<script>
    import Settings from '~/components/setting/Settings';

    export default {
        async fetch({store, error}) {
            try {
                await store.dispatch(`setting/getSetting`);
            } catch (e) {
                error({statusCode: e.statusCode})
            }
        },
        components: {Settings}
    }
</script>

<style lang="scss">
    #ely-user-setting-layout {
        h2 {
            font-size: 18px;
            color: $primary-color;
        }
    }
</style>