<template>
    <div class="public-transparency explanation-element">
        <div class="public-image public-image-mobile" @click="openGithub" v-if="!showMobile">
            <img v-lazy="transparency">
        </div>
        <div class="public-description-container transparency-container">
            <h2 class="title-description">Transparenz</h2>
            <div class="public-image public-image-mobile" @click="openGithub" v-if="showMobile">
                <img v-lazy="transparency">
            </div>
            <div class="description">
                Der komplette Source Code von DumondaMe ist Open Source. Auf diese Weise kann die Funktionsweise der
                Algorithmen transparent überprüft werden.
            </div>
            <v-btn color="secondary" class="action-button" @click="openGithub">
                Code auf Github
            </v-btn>
        </div>
    </div>
</template>

<script>
    export default {
        props: ['showMobile'],
        computed: {
            transparency() {
                return `${process.env.staticUrl}/img/landingPagePublic/github.png`;
            },
        },
        methods: {
            openGithub() {
                window.open('https://github.com/DumondaMe/DumondaMe', '_blank');
            }
        }
    }
</script>

<style lang="scss">
    .public-transparency.explanation-element {
        .public-description-container.transparency-container {
            padding-left: 56px;

            @media screen and (max-width: 900px) {
                padding-left: 16px;
            }
        }

        .public-image {
            cursor: pointer;

            @media screen and (max-width: 900px) {
                padding: 0 16px;
                margin-bottom: 28px;
            }
        }
    }
</style>
