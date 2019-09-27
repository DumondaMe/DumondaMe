<template>
    <div id="dumonda-me-topics">
        <card topic="Bildung & Lernen" :topic-id="'Education'"></card>
        <card topic="Gesellschaft" :topic-id="'SocialDevelopment'"></card>
        <card topic="Gesundheit" :topic-id="'Health'"></card>
        <card topic="Konsum & Suffizienz" :topic-id="'ConsumptionSufficiency'"></card>
        <card topic="Kunst & Kultur" :topic-id="'ArtCulture'"></card>
        <card topic="Landwirtschaft & Lebensmittel" :topic-id="'FoodAgriculture'"></card>
        <card topic="Spiritualität & Bewusstsein" :topic-id="'SpiritualityConsciousness'"></card>
        <card topic="Technologie" :topic-id="'Technology'"></card>
        <card topic="Umwelt" :topic-id="'Environment'"></card>
        <card topic="Wirtschaft & Finanzen" :topic-id="'EconomyFinances'"></card>
        <card topic="Wissenschaft" :topic-id="'Science'"></card>
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

        @media screen and (max-width: 959px) {
            width: 600px;
            margin-right: auto;
            margin-left: auto;
        }

        @media screen and (max-width: 600px) {
            width: 300px;
        }
    }
</style>