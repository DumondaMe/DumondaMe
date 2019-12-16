<template>
    <div class="feed-donation-container ely-card">
        <div class="dumonda-me-donation-status-container">
            <v-progress-linear
                    color="success lighten-2"
                    height="12"
                    :value="donationActualState">
            </v-progress-linear>
            <div class="donation-state-info"><span
                    class="state-number actual-state">{{donationActualNumber}} CHF </span>
                {{$t('pages:landingPagePublic.donation.donationStatus.of')}}
                <span class="state-number">{{donationGoal}} CHF</span>
            </div>
        </div>
        <div class="donation-image-container" ref="donationContent" v-show="$vuetify.breakpoint.width > 700">
            <iframe :width="youtubeWidth" :height="youtubeHeight" :src="youtubeEmbedAutoplay" frameBorder="0"
                    allow="autoplay" v-if="showEmbed"></iframe>
            <img :src="donateImage" class="donate-image" @click="showEmbed = true" v-if="!showEmbed">
            <img :src="videoButton" class="video-button" @click="showEmbed = true" v-if="!showEmbed">
        </div>
        <div class="feed-networking-description">{{$t('pages:landingPagePublic.donation.description')}}</div>
        <v-btn outlined color="primary" @click="$router.push({name: 'donation'})">
            {{$t('common:button.donate')}}
        </v-btn>
    </div>
</template>

<script>
    import {mapGetters} from 'vuex';

    export default {
        data() {
            return {showEmbed: false}
        },
        computed: {
            donateImage() {
                return `https://img.youtube.com/vi/h9uxDj7gn9s/0.jpg`;
            },
            videoButton() {
                return `${process.env.staticUrl}/img/youtube.png`;
            },
            youtubeEmbedAutoplay() {
                return `https://www.youtube.com/embed/h9uxDj7gn9s?autoplay=1`;
            },
            youtubeWidth() {
                return this.$refs.donationContent.clientWidth;
            },
            youtubeHeight() {
                return this.$refs.donationContent.clientWidth * 0.8;
            },
            ...mapGetters({
                donationGoal: 'donation/getDonationGoal',
                donationActualNumber: 'donation/getDonationActualNumber',
                donationActualState: 'donation/getDonationActualState'
            })
        }
    }
</script>

<style lang="scss">
    .feed-donation-container {
        margin-bottom: 18px;
        font-size: 14px;
        font-weight: 300;
        max-width: 550px;
        margin-left: auto;
        margin-right: auto;

        @media screen and (max-width: $xs) {
            margin-bottom: 0;
        }

        .dumonda-me-donation-status-container {
            margin-bottom: 18px;

            @include defaultPaddingCard();

            .donation-state-info {
                margin-top: 12px;
                font-size: 14px;
                color: $secondary-text;

                .state-number {
                    font-weight: 500;
                }

                .actual-state {
                    color: $primary-color;
                }
            }
        }

        .donation-image-container {
            width: 100%;
            position: relative;
            .donate-image {
                width: 100%;
                cursor: pointer;
                margin-bottom: 8px;
            }

            img.video-button {
                position: absolute;
                cursor: pointer;
                left: 50%;
                top: 50%;
                width: 70px;
                margin-left: -35px;
                margin-top: -25px;
                border: none;

                @media screen and (max-width: 900px) {
                    width: 60px;
                    margin-left: -30px;
                    margin-top: -21px;
                }
            }
        }

        .feed-networking-description {
            margin-bottom: 8px;
            font-size: 16px;
            @include defaultPaddingCard();
        }

        button {
            margin-left: 18px;

            @media screen and (max-width: 700px) {
                margin-left: 12px;

            }
        }

    }
</style>