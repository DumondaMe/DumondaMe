<template>
    <div class="public-youtube explanation-element">
        <div class="public-description-container left-description">
            <h2 class="title-description">Mehr über DumondaMe erfahren?</h2>
            <div class="description">
                Auf unserem Youtube Channel findest du viele Videos, welche dir dieses Projekt näher bringen. Unter
                anderem findest du ein Video, welches die Bedeutung des Namen DumondaMe erklärt.
            </div>
            <v-btn color="secondary" class="action-button" @click="openYoutubeChannel">
                Youtube Channel
            </v-btn>
        </div>
        <div class="public-image" @click="openYoutubeChannel">
            <img :src="youtube">
        </div>
    </div>
</template>

<script>
    export default {
        computed: {
            youtube() {
                return `${process.env.staticUrl}/img/landingPagePublic/youtube.jpg`;
            }
        },
        methods: {
            openYoutubeChannel() {
                window.open('https://www.youtube.com/channel/UCl74yeMn-EzqwcE2Rd-wIzQ', '_blank');
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
