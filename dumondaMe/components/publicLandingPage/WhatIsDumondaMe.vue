<template>
    <div class="public-why-dumonda-me explanation-element">
        <div class="public-image" @click="openExplainVideo" v-if="!showMobile">
            <img :src="explainVideo">
        </div>
        <div class="public-description-container">
            <h2 class="title-description">{{$t('pages:landingPagePublic.whatIsDumondaMe.title')}}</h2>
            <div class="public-image" @click="openExplainVideo" v-if="showMobile">
                <img :src="explainVideo">
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
            cursor: pointer;
        }
    }
</style>
