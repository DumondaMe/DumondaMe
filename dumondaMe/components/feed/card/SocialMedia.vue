<template>
    <div class="social-media-feed-card">
        <div class="social-media-title">{{$t('pages:feeds.socialMedia.title')}}</div>
        <img v-lazy="spreadTheWordImage" :data-srcset="spreadTheWord2xImage" class="spread-the-word-image">
        <div class="social-media-description">{{$t('pages:feeds.socialMedia.description')}}</div>
        <social-media-links></social-media-links>
    </div>
</template>

<script>
    import SocialMediaLinks from '~/components/info/SocialMediaLinks';

    export default {
        components: {SocialMediaLinks},
        computed: {
            spreadTheWordImage() {
                return `${process.env.staticUrl}/img/landingPage/spreadTheWord.jpg`;
            },
            spreadTheWord2xImage() {
                return `${process.env.staticUrl}/img/landingPage/spreadTheWord.jpg 500w, ` +
                       `${process.env.staticUrl}/img/landingPage/spreadTheWord_2x.jpg 1000w`;
            }
        }
    }
</script>

<style lang="scss">
    .social-media-feed-card {
        .social-media-title {
            color: $secondary-color;
            font-size: 16px;
            font-weight: 500;
            margin-bottom: 6px;
            @include defaultPaddingCard();
        }

        .social-media-description {
            margin-top: 8px;
            font-weight: 300;
            @include defaultPaddingCard();
        }

        .spread-the-word-image {
            margin-top: 8px;
            width: 100%;
        }

        .social-media-links-container {
            margin-top: 18px;
            @include defaultPaddingCard();

            .social-media-links-inner-container {
                margin: 0;
            }
        }
    }
</style>
