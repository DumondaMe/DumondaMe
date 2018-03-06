<template>
    <div id="ely-user-setting-layout">
        <h1>Einstellungen</h1>
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
        h1 {
            border-bottom: 1px solid $divider;
            padding-bottom: 4px;
            margin-bottom: 32px;
            color: $primary-color;
        }
        h2 {
            font-size: 18px;
        }
    }
</style>