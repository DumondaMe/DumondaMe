<template>
    <div class="public-youtube explanation-element">
        <div class="public-description-container left-description">
            <h2 class="title-description">{{$t('pages:landingPagePublic.youtube.title')}}</h2>
            <div class="public-image" @click="openYoutubeVideo" v-if="showMobile">
                <img v-lazy="youtube">
            </div>
            <div class="description">
                {{$t('pages:landingPagePublic.youtube.description')}}
            </div>
            <v-btn color="secondary" class="action-button" @click="openYoutubeChannel">
                {{$t('pages:landingPagePublic.youtube.actionButton')}}
            </v-btn>
        </div>
        <div class="public-image" @click="openYoutubeVideo" v-if="!showMobile">
            <img v-lazy="youtube">
        </div>
    </div>
</template>

<script>
    export default {
        props: ['showMobile'],
        computed: {
            youtube() {
                return `${process.env.staticUrl}/img/landingPagePublic/youtube.jpg`;
            }
        },
        methods: {
            openYoutubeChannel() {
                window.open('https://www.youtube.com/channel/UCl74yeMn-EzqwcE2Rd-wIzQ', '_blank');
            },
            openYoutubeVideo() {
                window.open('https://www.youtube.com/watch?v=eZelQvUkQxw', '_blank');
            }
        }
    }
</script>

<style lang="scss">
    .public-youtube {
        .public-image {
            cursor: pointer;
        }
    }
</style>
