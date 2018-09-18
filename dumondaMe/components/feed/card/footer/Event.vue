<template>
    <div class="card-footer-feed">
        <div class="footer-icon">
            <commitment-menu :menu-title="$t('pages:feeds.menu.eventCreateByCommitment.title')"
                             :commitment-image="commitmentImagePreview" :commitment="commitment"
                             :commitment-id="commitmentId" :commitment-slug="commitmentSlug"
                             :description="commitmentDescription">
                <div class="user-icon creator-icon" slot="icon">
                    <img :src="commitmentImage">
                </div>
            </commitment-menu>
        </div>
        <div class="footer-icon">
            <v-icon medium class="action-icon">
                mdi-map-marker
            </v-icon>
            <span class="footer-description">{{location}} ({{region}})</span>
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
</style>