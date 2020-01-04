<template>
    <div id="on-tour-feed-container">
        <div class="on-tour-description-container ely-card">
            <h1 class="on-tour-title">{{$t('pages:feeds:harvesting.title')}}</h1>
            <div class="on-tour-description">{{$t('pages:feeds:harvesting.description')}}</div>
        </div>
        <events></events>
    </div>
</template>

<script>
    import Events from '~/components/harvestingEvents/Events';

    export default {
        async fetch({error, store}) {
            try {
                await store.dispatch(`harvestingEvents/getHarvestingEvents`);
            } catch (e) {
                if (e && e.request && e.request.res && e.request.res.statusCode) {
                    error({statusCode: e.request.res.statusCode});
                } else {
                    error();
                }
            }

        },
        components: {
            Events
        },
        data() {
            return {loadNextRunning: false}
        }
    }
</script>

<style lang="scss">
    #on-tour-feed-container {
        padding-top: 28px;
        padding-bottom: 64px;

        .on-tour-description-container {
            @include defaultPaddingCard();

            .on-tour-title {
                font-size: 18px;
                font-weight: 500;
            }

            .on-tour-description {
                margin-top: 12px;
                font-weight: 300;
            }
        }
    }
</style>