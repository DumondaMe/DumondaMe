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
        <img :src="donateImage" class="donate-image">
        <div class="feed-networking-description">{{$t('pages:landingPagePublic.donation.description')}}</div>
        <v-btn outline color="primary" @click="$router.push({name: 'donation'})">
            {{$t('common:button.donate')}}
        </v-btn>
    </div>
</template>

<script>

    export default {
        data() {
            return {}
        },
        computed: {
            donateImage() {
                return `${process.env.staticUrl}/img/landingPage/donate.jpg`;
            },
            donationGoal() {
                let number = parseInt(process.env.donationGoal, 10);
                return number.toLocaleString('ch-DE', {useGrouping: true});
            },
            donationActualNumber() {
                let number = parseInt(process.env.donationActualNumber, 10);
                return number.toLocaleString('ch-DE', {useGrouping: true});
            },
            donationActualState() {
                return (parseInt(process.env.donationActualNumber, 10) * 100) / parseInt(process.env.donationGoal, 10);
            }
        }
    }
</script>

<style lang="scss">
    .feed-donation-container {
        margin-bottom: 18px;
        font-size: 14px;
        font-weight: 300;

        @media screen and (max-width: 900px) {
            margin-top: 48px;
        }

        .dumonda-me-donation-status-container {
            margin-bottom: 18px;

            .donation-state-info {
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

        .donate-image {
            width: 100%;
            border-radius: 4px;
            margin-bottom: 8px;
        }

        .feed-networking-description {
            margin-bottom: 8px;
        }

        button {
            margin-left: 0;
        }

    }
</style>