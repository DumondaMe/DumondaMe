<template>
    <div class="donation-status">
        <v-progress-linear
                color="success lighten-2"
                height="12"
                :value="donationActualState">
        </v-progress-linear>
        <div class="donation-state-info"><span class="state-number actual-state">{{donationActualNumber}} CHF </span>
            {{$t('pages:landingPagePublic.donation.donationStatus.of')}}
            <span class="state-number">{{donationGoal}} CHF</span>
        </div>
        <div class="donation-description">
            {{$t('pages:landingPagePublic.donation.donationStatus.description',
            {donationGoal: donationGoal})}}
        </div>
    </div>
</template>

<script>
    export default {
        computed: {
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
    .donation-status {
        min-width: 350px;
        border: 1px solid $divider;
        border-radius: 4px;
        padding: 16px;
        background-color: $background-normal;

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

        .donation-description {
            margin-top: 18px;
            font-size: 16px;
            color: $secondary-text;
            max-width: 320px;
        }
    }
</style>
