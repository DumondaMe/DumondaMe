<template>
    <div class="card-footer-feed">
        <div class="footer-icon">
            <div class="user-icon creator-icon">
                <img :src="commitmentImage">
            </div>
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
    export default {
        props: ['commitment', 'commitmentId', 'commitmentSlug', 'commitmentImage', 'location', 'region']
    }
</script>

<style lang="scss">
</style>