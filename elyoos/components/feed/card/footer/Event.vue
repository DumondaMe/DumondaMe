<template>
    <div class="card-footer-feed card-footer-feed-event">
        <div class="footer-icon">
            <v-tooltip bottom>
                <v-icon slot="activator" class="action-icon">
                    mdi-human-handsup
                </v-icon>
                <span> Veranstaltung von {{creator}}</span>
            </v-tooltip>
            <span class="footer-text">
                <span class="footer-link" @click="$router.push({name: 'commitment-commitmentId-slug',
                     params: {commitmentId: creatorId, slug: creatorSlug}})">{{creator}}</span></span>

        </div>
        <div class="footer-icon">
            <v-icon>mdi-clock</v-icon>
            <span class="footer-text">{{startDate | formatFromToDate(endDate, $t('common:at'))}}</span>
        </div>
        <div class="footer-icon">
            <v-icon>mdi-map-marker</v-icon>
            <span class="footer-text">{{location}} ({{$t("regions:" + region)}})</span>
        </div>
    </div>
</template>

<script>
    export default {
        props: ['creator', 'creatorId', 'creatorSlug','startDate', 'endDate', 'location', 'region']
    }
</script>

<style lang="scss">
    .card-footer-feed.card-footer-feed-event {
        .footer-icon {
            display: block;
        }
    }
</style>