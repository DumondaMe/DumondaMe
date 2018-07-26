<template>
    <div class="card-footer-feed card-footer-feed-event">
        <div class="footer-content">
            <span class="footer-description">Wann:</span>
            <span class="footer-text">{{startDate | formatFromToDate(endDate, $t('common:at'))}}</span>
        </div>
        <div class="footer-content">
            <span class="footer-description">Wo:</span>
            <span class="footer-text">{{location}} ({{$t("regions:" + region)}})</span>
        </div>
        <div class="footer-content">
            <span class="footer-description">Wer:</span>
            <span class="footer-link" @click="$router.push({name: 'commitment-commitmentId-slug',
                     params: {commitmentId: creatorId, slug: creatorSlug}})">{{creator}}</span>

        </div>
    </div>
</template>

<script>
    export default {
        props: ['creator', 'creatorId', 'creatorSlug', 'startDate', 'endDate', 'location', 'region']
    }
</script>

<style lang="scss">
    .card-footer-feed.card-footer-feed-event {
        .footer-content {
            display: block;
            font-size: 12px;
            margin-bottom: 4px;
            color: $secondary-text;
            .footer-description {
                display: inline-block;
                font-weight: 500;
                min-width: 50px;
                color: $primary-text;
            }
            .footer-link {
                cursor: pointer;
            }
            :hover.footer-link {
                text-decoration: underline;
            }
        }
    }
</style>