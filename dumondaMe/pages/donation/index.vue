<template>
    <div id="dumonda-me-donation">
        <p v-html="$t('pages:donation.description')"></p>
        <div class="dds-widget-container" data-widget="lema"></div>
    </div>
</template>

<script>
    import {mapGetters} from 'vuex';

    export default {
        async fetch({store}) {
            store.commit('toolbar/SHOW_BACK_BUTTON');
        },
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
        padding-top: 18px;

        @media screen and (max-width: $xs) {
            padding-right: 18px;
            padding-left: 18px;
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