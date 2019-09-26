<template>
    <div id="dumonda-me-topics">
        <card topic="Bildung & Lernen" :topic-id="'5932e562e0f5e000'"></card>
        <card topic="Gesellschaft" :topic-id="'5945285f05691000'"></card>
        <card topic="Gesundheit" :topic-id="'594528935ce91000'"></card>
        <card topic="Konsum & Suffizienz" :topic-id="'qJItLlh8wrXZTgb'"></card>
        <card topic="Kunst & Kultur" :topic-id="'59452a3ef8a91000'"></card>
        <card topic="Landwirtschaft & Lebensmittel" :topic-id="'5945298a6b291000'"></card>
        <card topic="Spiritualität & Bewusstsein" :topic-id="'59452a1840691000'"></card>
        <card topic="Technologie" :topic-id="'5945287e93a91000'"></card>
        <card topic="Umwelt" :topic-id="'593c1ecffb909000'"></card>
        <card topic="Wirtschaft & Finanzen" :topic-id="'5932e90a1835e000'"></card>
        <card topic="Wissenschaft" :topic-id="'594529f733291000'"></card>
    </div>
</template>

<script>
    import Card from '~/components/topic/Card';

    export default {
        async fetch({store, error}) {
            /*try {
                await store.dispatch(`setting/getSetting`);
            } catch (e) {
                if (e && e.request && e.request.res && e.request.res.statusCode) {
                    error({statusCode: e.request.res.statusCode});
                } else {
                    error({statusCode: 600});
                }
            }
            store.commit('toolbar/SHOW_BACK_BUTTON');*/
        },
        components: {Card}
    }
</script>

<style lang="scss">
    #dumonda-me-topics {
        padding-top: 28px;
        display: flex;
        flex-wrap: wrap;

    }
</style>