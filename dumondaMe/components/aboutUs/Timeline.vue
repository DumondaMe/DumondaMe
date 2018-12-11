<template>
    <div>
        <h2 class="subtitle">{{$t('pages:aboutUs.history.title')}}</h2>
        <v-timeline align-top id="dumonda-me-history-timeline" v-if="showTimeline"
                    :dense="showDenseTimeline">
            <timeline-element color="#009e97" icon="mdi-lightbulb-on-outline"
                              :date="$t('pages:aboutUs.history.thoughtFlash.date')"
                              :timeline-title="$t('pages:aboutUs.history.thoughtFlash.title')"
                              :timeline-text="$t('pages:aboutUs.history.thoughtFlash.text')">
            </timeline-element>
            <timeline-element color="#009e97" icon="mdi-ferry"
                              :date="$t('pages:aboutUs.history.openSea.date')"
                              :timeline-title="$t('pages:aboutUs.history.openSea.title')"
                              :timeline-text="$t('pages:aboutUs.history.openSea.text')">
            </timeline-element>
            <timeline-element color="#009e97" icon="mdi-alien"
                              :date="$t('pages:aboutUs.history.firstVersion.date')"
                              :timeline-title="$t('pages:aboutUs.history.firstVersion.title')"
                              :timeline-text="$t('pages:aboutUs.history.firstVersion.text')">
            </timeline-element>
            <timeline-element color="#757575" icon="mdi-nuke"
                              :date="$t('pages:aboutUs.history.crisis.date')"
                              :timeline-title="$t('pages:aboutUs.history.crisis.title')"
                              :timeline-text="$t('pages:aboutUs.history.crisis.text')">
            </timeline-element>
            <timeline-element color="#009e97" icon="mdi-play-circle-outline"
                              :date="$t('pages:aboutUs.history.goOn.date')"
                              :timeline-title="$t('pages:aboutUs.history.goOn.title')"
                              :timeline-text="$t('pages:aboutUs.history.goOn.text')">
            </timeline-element>
            <timeline-element color="#009e97" icon="mdi-cash-usd"
                              :date="$t('pages:aboutUs.history.money.date')"
                              :timeline-title="$t('pages:aboutUs.history.money.title')"
                              :timeline-text="$t('pages:aboutUs.history.money.text')">
            </timeline-element>
            <timeline-element color="#009e97" icon="mdi-account-plus"
                              :date="$t('pages:aboutUs.history.onToTwo.date')"
                              :timeline-title="$t('pages:aboutUs.history.onToTwo.title')"
                              :timeline-text="$t('pages:aboutUs.history.onToTwo.text')">
            </timeline-element>
            <timeline-element color="#009e97" icon="mdi-lan-connect"
                              :date="$t('pages:aboutUs.history.transitionConnect.date')"
                              :timeline-title="$t('pages:aboutUs.history.transitionConnect.title')"
                              :timeline-text="$t('pages:aboutUs.history.transitionConnect.text')">
            </timeline-element>
            <timeline-element color="#009e97" icon="mdi-account-group"
                              :date="$t('pages:aboutUs.history.clubElyoos.date')"
                              :timeline-title="$t('pages:aboutUs.history.clubElyoos.title')"
                              :timeline-text="$t('pages:aboutUs.history.clubElyoos.text')">
            </timeline-element>
            <timeline-element color="#009e97" icon="mdi-thumb-up"
                              :date="$t('pages:aboutUs.history.kulturparkZurich.date')"
                              :timeline-title="$t('pages:aboutUs.history.kulturparkZurich.title')"
                              :timeline-text="$t('pages:aboutUs.history.kulturparkZurich.text')">
            </timeline-element>
            <timeline-element color="#009e97" icon="mdi-clock-fast"
                              :date="$t('pages:aboutUs.history.alphaTransitionConnect.date')"
                              :timeline-title="$t('pages:aboutUs.history.alphaTransitionConnect.title')"
                              :timeline-text="$t('pages:aboutUs.history.alphaTransitionConnect.text')">
            </timeline-element>
            <timeline-element color="#009e97" icon="mdi-delete"
                              :date="$t('pages:aboutUs.history.three.date')"
                              :timeline-title="$t('pages:aboutUs.history.three.title')"
                              :timeline-text="$t('pages:aboutUs.history.three.text')">
            </timeline-element>
            <timeline-element color="#009e97" icon="mdi-account-multiple-plus"
                              :date="$t('pages:aboutUs.history.momoRonja.date')"
                              :timeline-title="$t('pages:aboutUs.history.momoRonja.title')"
                              :timeline-text="$t('pages:aboutUs.history.momoRonja.text')">
            </timeline-element>
            <timeline-element color="#009e97" icon="mdi-gesture-double-tap"
                              :date="$t('pages:aboutUs.history.conceptTest.date')"
                              :timeline-title="$t('pages:aboutUs.history.conceptTest.title')"
                              :timeline-text="$t('pages:aboutUs.history.conceptTest.text')">
            </timeline-element>
            <timeline-element color="#009e97" icon="mdi-emoticon-sad"
                              :date="$t('pages:aboutUs.history.nameCrash.date')"
                              :timeline-title="$t('pages:aboutUs.history.nameCrash.title')"
                              :timeline-text="$t('pages:aboutUs.history.nameCrash.text')">
            </timeline-element>
            <timeline-element color="#009e97" icon="mdi-cloud-upload"
                              :date="$t('pages:aboutUs.history.dumondaMeOnline.date')"
                              :timeline-title="$t('pages:aboutUs.history.dumondaMeOnline.title')"
                              :timeline-text="$t('pages:aboutUs.history.dumondaMeOnline.text')">
            </timeline-element>
            <timeline-element color="#009e97" icon="mdi-exclamation"
                              :date="$t('pages:aboutUs.history.elyoosToDumondaMe.date')"
                              :timeline-title="$t('pages:aboutUs.history.elyoosToDumondaMe.title')"
                              :timeline-text="$t('pages:aboutUs.history.elyoosToDumondaMe.text')">
            </timeline-element>
            <timeline-element color="#009e97" icon="mdi-earth"
                              :date="$t('pages:aboutUs.history.helloWorld.date')"
                              :timeline-title="$t('pages:aboutUs.history.helloWorld.title')"
                              :timeline-text="$t('pages:aboutUs.history.helloWorld.text')">
                <social-media-links slot="info"></social-media-links>
            </timeline-element>
            <timeline-element color="green lighten-1" icon="mdi-rocket"
                              :date="$t('pages:aboutUs.history.crowdfunding.date')"
                              :timeline-title="$t('pages:aboutUs.history.crowdfunding.title')"
                              :timeline-text="$t('pages:aboutUs.history.crowdfunding.text')">
            </timeline-element>
            <timeline-element color="green lighten-1" icon="mdi-auto-fix"
                              :date="$t('pages:aboutUs.history.nextSteps.date')"
                              :timeline-title="$t('pages:aboutUs.history.nextSteps.title')"
                              :timeline-text="$t('pages:aboutUs.history.nextSteps.text')">
            </timeline-element>
            <timeline-element color="green lighten-1" icon="mdi-human-handsup"
                              :date="$t('pages:aboutUs.history.goal.date')"
                              :timeline-title="$t('pages:aboutUs.history.goal.title')"
                              :timeline-text="$t('pages:aboutUs.history.goal.text')">
            </timeline-element>
        </v-timeline>
    </div>
</template>

<script>
    import TimelineElement from './TimelineElement';
    import SocialMediaLinks from '~/components/info/SocialMediaLinks';

    export default {
        components: {TimelineElement, SocialMediaLinks},
        data() {
            return {showDenseTimeline: false, showTimeline: false}
        },
        mounted() {
            this.showDenseTimeline = window.innerWidth < 600;
            this.showTimeline = true;
        }
    }
</script>

<style lang="scss">

</style>
