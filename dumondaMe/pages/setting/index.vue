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
                if (e && e.request && e.request.res && e.request.res.statusCode) {
                    error({statusCode: e.request.res.statusCode});
                } else {
                    error({statusCode: 600});
                }
            }
            store.commit('toolbar/SHOW_BACK_BUTTON');
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