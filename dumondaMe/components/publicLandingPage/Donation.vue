<template>
    <div id="public-donation" class="explanation-element">
        <donation-status v-if="!showMobile"></donation-status>
        <div class="public-description-container">
            <h2 class="title-description">{{$t('pages:landingPagePublic.donation.title')}}</h2>
            <donation-status v-if="showMobile"></donation-status>
            <div class="description">
                {{$t('pages:landingPagePublic.donation.description')}}
            </div>
            <v-btn color="secondary" class="action-button">
                {{$t('pages:landingPagePublic.donation.actionButton')}}
            </v-btn>
        </div>
    </div>
</template>

<script>
    import DonationStatus from './DonationStatus';

    export default {
        props: ['showMobile'],
        components: {
            DonationStatus
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
    }
</style>
