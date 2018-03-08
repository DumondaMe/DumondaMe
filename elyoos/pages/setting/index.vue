<template>
    <div id="ely-user-setting-layout">
        <language>
        </language>
        <privacy>
        </privacy>
    </div>
</template>

<script>
    import Language from '~/components/setting/Language.vue';
    import Privacy from '~/components/setting/Privacy.vue';

    export default {
        async fetch({store, error}) {
            try {
                await store.dispatch(`setting/getSetting`);
            } catch (e) {
                error({statusCode: e.statusCode})
            }
        },
        components: {Language, Privacy}
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