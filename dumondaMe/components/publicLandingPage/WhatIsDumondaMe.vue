<template>
    <div class="public-why-dumonda-me explanation-element">
        <div class="public-image" @click="openExplainVideo" v-if="!showMobile">
            <img :src="explainVideo">
            <img :src="videoButton" id="video-button">
        </div>
        <div class="public-description-container">
            <h2 class="title-description">{{$t('pages:landingPagePublic.whatIsDumondaMe.title')}}</h2>
            <div class="public-image" @click="openExplainVideo" v-if="showMobile">
                <img :src="explainVideo">
                <img :src="videoButton" id="video-button">
            </div>
            <div class="description">
                {{$t('pages:landingPagePublic.whatIsDumondaMe.description')}}
            </div>
            <v-btn color="secondary" class="action-button" @click="openExplainVideo">
                {{$t('pages:landingPagePublic.whatIsDumondaMe.actionButton')}}
            </v-btn>
        </div>
    </div>
</template>

<script>
    export default {
        props: ['showMobile'],
        computed: {
            explainVideo() {
                return `${process.env.staticUrl}/img/landingPagePublic/explainVideo.jpg`;
            },
            videoButton() {
                return `${process.env.staticUrl}/img/youtube.png`;
            }
        },
        methods: {
            openExplainVideo() {
                window.open('https://youtu.be/hcCvaH0RJj4', '_blank');
            }
        }
    }
</script>

<style lang="scss">
    .public-why-dumonda-me {
        .public-image {
            position: relative;
            cursor: pointer;

            img#video-button {
                position: absolute;
                left: 50%;
                top: 50%;
                width: 70px;
                margin-left: -35px;
                margin-top: -25px;

                @media screen and (max-width: 900px) {
                    width: 60px;
                    margin-left: -30px;
                    margin-top: -21px;
                }
            }
        }
    }
</style>
