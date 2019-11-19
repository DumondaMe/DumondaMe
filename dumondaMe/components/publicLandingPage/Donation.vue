<template>
    <div id="public-donation" class="explanation-element">
        <div class="public-image" @click="openExplainVideo" v-if="!showMobile">
            <img v-lazy="explainVideo">
        </div>
        <div class="public-description-container">
            <h2 class="title-description">{{$t('pages:landingPagePublic.donation.title')}}</h2>
            <div class="public-image" @click="openExplainVideo" v-if="showMobile">
                <img v-lazy="explainVideo">
            </div>
            <div class="description">
                {{$t('pages:landingPagePublic.donation.description')}}
            </div>
            <v-btn color="secondary" class="action-button" @click="$router.push({name: 'donation'})">
                {{$t('common:button.donate')}}
            </v-btn>
        </div>
    </div>
</template>

<script>
    export default {
        props: ['showMobile'],
        computed: {
            explainVideo() {
                return `${process.env.staticUrl}/img/landingPagePublic/donation.jpg`;
            }
        },
        methods: {
            openExplainVideo() {
                window.open('https://youtu.be/h9uxDj7gn9s', '_blank');
            }
        }
    }
</script>

<style lang="scss">
    #public-donation {
        .public-description-container {
            .description {
                @media screen and (max-width: 900px) {
                    margin-top: 24px;
                }
            }
        }

        .public-image {
            position: relative;
            cursor: pointer;

            img.video-button {
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
