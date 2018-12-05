<template>
    <div class="social-media-feed-card">
        <div class="social-media-title">{{$t('pages:feeds.socialMedia.title')}}</div>
        <div class="social-media-description">{{$t('pages:feeds.socialMedia.description')}}</div>
        <social-media-links></social-media-links>
    </div>
</template>

<script>
    import SocialMediaLinks from '~/components/info/SocialMediaLinks';

    export default {
        components: {SocialMediaLinks}
    }
</script>

<style lang="scss">
    .social-media-feed-card {
        .social-media-title {
            color: $secondary-color;
            font-size: 16px;
            font-weight: 500;
        }

        .social-media-description {
            margin-top: 12px;
            font-weight: 300;
        }

        .social-media-links-container {
            margin-top: 18px;

            .social-media-links-inner-container {
                margin: 0;
            }
        }
    }
</style>
