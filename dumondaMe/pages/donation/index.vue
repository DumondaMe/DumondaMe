<template>
    <div id="dumonda-me-donation">
        <div id="dumonda-me-donation-status-container">
            <v-progress-linear
                    color="success lighten-2"
                    height="12"
                    :value="donationActualState">
            </v-progress-linear>
            <div class="donation-state-info"><span
                    class="state-number actual-state">{{donationActualNumber}} CHF </span>
                {{$t('pages:landingPagePublic.donation.donationStatus.of')}}
                <span class="state-number">{{donationGoal}} CHF</span>
                ({{$t('pages:donation.stateInfo')}})
            </div>
        </div>
        <p v-html="$t('pages:donation.description')"></p>
        <div class="dds-widget-container" data-widget="lema"></div>
    </div>
</template>

<script>
    import {mapGetters} from 'vuex';

    export default {
        computed: {
            ...mapGetters({
                donationGoal: 'donation/getDonationGoal',
                donationActualNumber: 'donation/getDonationActualNumber',
                donationActualState: 'donation/getDonationActualState'
            })
        },
        head() {
            return {
                script: [{
                    language: 'javascript', type: 'text/javascript',
                    src: 'https://widget.raisenow.com/widgets/lema/dumon-9bff/js/dds-init-widget-de.js'
                }]
            }
        }
    }
</script>

<style lang="scss">
    #dumonda-me-donation {

        @media screen and (max-width: 900px) {
            padding-top: 18px;
            padding-right: 8px;
            padding-left: 8px;
        }

        #dumonda-me-donation-status-container {
            margin-bottom: 32px;

            .donation-state-info {
                margin-top: 18px;
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

        p {
            font-weight: 300;
        }

        .dds-widget-container {
            margin-top: 32px;

            #lema-container.lema-container .lema-wrapper .lema-step-header-text {
                color: $primary-color;
            }

            #lema-container.lema-container input.getunik-radio:checked + label.getunik-radio-label {
                color: $primary-color;
            }
        }
    }
</style>