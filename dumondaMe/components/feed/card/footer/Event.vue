<template>
    <div class="card-footer-feed">
        <div class="footer-icon footer-event-location-icon">
            <commitment-menu :menu-title="$t('pages:feeds.menu.eventCreateByCommitment.title')"
                             :commitment-image="commitmentImagePreview" :commitment="commitment"
                             :commitment-id="commitmentId" :commitment-slug="commitmentSlug"
                             :description="commitmentDescription">
                <div class="user-icon creator-icon" slot="icon">
                    <img :src="commitmentImage">
                </div>
            </commitment-menu>
        </div>
        <div class="footer-icon footer-event-location-icon">
            <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                    <v-icon medium class="action-icon" v-on="on">
                        mdi-map-marker
                    </v-icon>
                </template>
                <span>{{$t('pages:feeds.menu.eventCreateByCommitment.region')}}</span>
            </v-tooltip>
        </div>
        <div class="footer-event-description">
            <v-tooltip bottom open-delay="500">
                <template v-slot:activator="{ on }">
                    <span v-on="on">{{location}} ({{region}})</span>
                </template>
                <span>{{location}} ({{region}})</span>
            </v-tooltip>
        </div>
    </div>
</template>

<script>
    import CommitmentMenu from './menu/Commitment';

    export default {
        props: ['commitment', 'commitmentId', 'commitmentSlug', 'commitmentImage', 'commitmentImagePreview', 'location',
            'region', 'commitmentDescription'],
        components: {CommitmentMenu},
    }
</script>

<style lang="scss">
    .feed-card {
        .card-footer-feed {
            .footer-icon.footer-event-location-icon {
                display: block;

                .action-icon {
                    display: block;
                }
            }

            .footer-event-description {
                display: block;
                vertical-align: middle;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                line-height: 28px;
                height: 28px;
                margin: 10px 0 0 4px;
                color: $secondary-text;
                font-size: 14px;
                font-weight: 500;
            }
        }
    }
</style>