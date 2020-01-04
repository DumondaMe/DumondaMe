<template>
    <div id="about-us-timeline">
        <h2 class="subtitle">{{$t('pages:aboutUs.history.title')}}</h2>
        <v-timeline align-top id="dumonda-me-history-timeline" v-if="showTimeline"
                    :dense="showDenseTimeline">
            <timeline-element color="#009e97" :icon="$icons.mdiLightbulbOnOutline"
                              :date="$t('pages:aboutUs.history.thoughtFlash.date')"
                              :timeline-title="$t('pages:aboutUs.history.thoughtFlash.title')"
                              :timeline-text="$t('pages:aboutUs.history.thoughtFlash.text')">
            </timeline-element>
            <timeline-element color="#009e97" :icon="$icons.mdiFerry"
                              :date="$t('pages:aboutUs.history.openSea.date')"
                              :timeline-title="$t('pages:aboutUs.history.openSea.title')"
                              :timeline-text="$t('pages:aboutUs.history.openSea.text')">
            </timeline-element>
            <timeline-element color="#009e97" :icon="$icons.mdiAlien"
                              :date="$t('pages:aboutUs.history.firstVersion.date')"
                              :timeline-title="$t('pages:aboutUs.history.firstVersion.title')"
                              :timeline-text="$t('pages:aboutUs.history.firstVersion.text')">
            </timeline-element>
            <timeline-element color="#757575" :icon="$icons.mdiNuke"
                              :date="$t('pages:aboutUs.history.crisis.date')"
                              :timeline-title="$t('pages:aboutUs.history.crisis.title')"
                              :timeline-text="$t('pages:aboutUs.history.crisis.text')">
            </timeline-element>
            <timeline-element color="#009e97" :icon="$icons.mdiPlayCircleOutline"
                              :date="$t('pages:aboutUs.history.goOn.date')"
                              :timeline-title="$t('pages:aboutUs.history.goOn.title')"
                              :timeline-text="$t('pages:aboutUs.history.goOn.text')">
            </timeline-element>
            <timeline-element color="#009e97" :icon="$icons.mdiCashUsd"
                              :date="$t('pages:aboutUs.history.money.date')"
                              :timeline-title="$t('pages:aboutUs.history.money.title')"
                              :timeline-text="$t('pages:aboutUs.history.money.text')">
            </timeline-element>
            <timeline-element color="#009e97" :icon="$icons.mdiAccountPlus"
                              :date="$t('pages:aboutUs.history.onToTwo.date')"
                              :timeline-title="$t('pages:aboutUs.history.onToTwo.title')"
                              :timeline-text="$t('pages:aboutUs.history.onToTwo.text')">
            </timeline-element>
            <timeline-element color="#009e97" :icon="$icons.mdiLanConnect"
                              :date="$t('pages:aboutUs.history.transitionConnect.date')"
                              :timeline-title="$t('pages:aboutUs.history.transitionConnect.title')"
                              :timeline-text="$t('pages:aboutUs.history.transitionConnect.text')">
            </timeline-element>
            <timeline-element color="#009e97" :icon="$icons.mdiAccountGroup"
                              :date="$t('pages:aboutUs.history.clubElyoos.date')"
                              :timeline-title="$t('pages:aboutUs.history.clubElyoos.title')"
                              :timeline-text="$t('pages:aboutUs.history.clubElyoos.text')">
            </timeline-element>
            <timeline-element color="#009e97" :icon="$icons.mdiThumbUp"
                              :date="$t('pages:aboutUs.history.kulturparkZurich.date')"
                              :timeline-title="$t('pages:aboutUs.history.kulturparkZurich.title')"
                              :timeline-text="$t('pages:aboutUs.history.kulturparkZurich.text')">
            </timeline-element>
            <timeline-element color="#009e97" :icon="$icons.mdiClockFast"
                              :date="$t('pages:aboutUs.history.alphaTransitionConnect.date')"
                              :timeline-title="$t('pages:aboutUs.history.alphaTransitionConnect.title')"
                              :timeline-text="$t('pages:aboutUs.history.alphaTransitionConnect.text')">
            </timeline-element>
            <timeline-element color="#009e97" :icon="$icons.mdiDelete"
                              :date="$t('pages:aboutUs.history.three.date')"
                              :timeline-title="$t('pages:aboutUs.history.three.title')"
                              :timeline-text="$t('pages:aboutUs.history.three.text')">
            </timeline-element>
            <timeline-element color="#009e97" :icon="$icons.mdiAccountMultiplePlus"
                              :date="$t('pages:aboutUs.history.momoRonja.date')"
                              :timeline-title="$t('pages:aboutUs.history.momoRonja.title')"
                              :timeline-text="$t('pages:aboutUs.history.momoRonja.text')">
            </timeline-element>
            <timeline-element color="#009e97" :icon="$icons.mdiGestureDoubleTap"
                              :date="$t('pages:aboutUs.history.conceptTest.date')"
                              :timeline-title="$t('pages:aboutUs.history.conceptTest.title')"
                              :timeline-text="$t('pages:aboutUs.history.conceptTest.text')">
            </timeline-element>
            <timeline-element color="#009e97" :icon="$icons.mdiEmoticonSad"
                              :date="$t('pages:aboutUs.history.nameCrash.date')"
                              :timeline-title="$t('pages:aboutUs.history.nameCrash.title')"
                              :timeline-text="$t('pages:aboutUs.history.nameCrash.text')">
            </timeline-element>
            <timeline-element color="#009e97" :icon="$icons.mdiCloudUpload"
                              :date="$t('pages:aboutUs.history.dumondaMeOnline.date')"
                              :timeline-title="$t('pages:aboutUs.history.dumondaMeOnline.title')"
                              :timeline-text="$t('pages:aboutUs.history.dumondaMeOnline.text')">
            </timeline-element>
            <timeline-element color="#009e97" :icon="$icons.mdiExclamation"
                              :date="$t('pages:aboutUs.history.elyoosToDumondaMe.date')"
                              :timeline-title="$t('pages:aboutUs.history.elyoosToDumondaMe.title')"
                              :timeline-text="$t('pages:aboutUs.history.elyoosToDumondaMe.text')">
            </timeline-element>
            <timeline-element color="#009e97" :icon="$icons.mdiEarth"
                              :date="$t('pages:aboutUs.history.helloWorld.date')"
                              :timeline-title="$t('pages:aboutUs.history.helloWorld.title')"
                              :timeline-text="$t('pages:aboutUs.history.helloWorld.text')">
                <social-media-links slot="info"></social-media-links>
            </timeline-element>
            <timeline-element color="#009e97" :icon="$icons.mdiAccountGroup"
                              :date="$t('pages:aboutUs.history.sociocracy.date')"
                              :timeline-title="$t('pages:aboutUs.history.sociocracy.title')"
                              :timeline-text="$t('pages:aboutUs.history.sociocracy.text')">
            </timeline-element>
            <timeline-element color="#D81B60" :icon="$icons.mdiEmoticonExcited" v-if="!isAuthenticated"
                              :date="$t('pages:aboutUs.history.register.date')"
                              :timeline-title="$t('pages:aboutUs.history.register.title')"
                              :timeline-text="$t('pages:aboutUs.history.register.text')">
                <div slot="info">
                    <v-btn color="secondary" class="register-button" @click="$router.push({name: 'register'})">
                        {{$t('common:button.register')}}
                    </v-btn>
                </div>
            </timeline-element>
            <timeline-element color="green lighten-1" :icon="$icons.mdiAutoFix"
                              :date="$t('pages:aboutUs.history.nextSteps.date')"
                              :timeline-title="$t('pages:aboutUs.history.nextSteps.title')"
                              :timeline-text="$t('pages:aboutUs.history.nextSteps.text')">
            </timeline-element>
            <timeline-element color="green lighten-1" :icon="$icons.mdiHumanHandsup"
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
    import {
        mdiLightbulbOnOutline,
        mdiFerry,
        mdiAlien,
        mdiNuke,
        mdiPlayCircleOutline,
        mdiCashUsd,
        mdiAccountPlus,
        mdiLanConnect,
        mdiAccountGroup,
        mdiThumbUp,
        mdiClockFast,
        mdiDelete,
        mdiAccountMultiplePlus,
        mdiGestureDoubleTap,
        mdiEmoticonSad,
        mdiCloudUpload,
        mdiExclamation,
        mdiEarth,
        mdiEmoticonExcited,
        mdiAutoFix,
        mdiHumanHandsup
    } from '@mdi/js';

    export default {
        components: {TimelineElement, SocialMediaLinks},
        created() {
          this.$icons = {
              mdiLightbulbOnOutline,
              mdiFerry,
              mdiAlien,
              mdiNuke,
              mdiPlayCircleOutline,
              mdiCashUsd,
              mdiAccountPlus,
              mdiLanConnect,
              mdiAccountGroup,
              mdiThumbUp,
              mdiClockFast,
              mdiDelete,
              mdiAccountMultiplePlus,
              mdiGestureDoubleTap,
              mdiEmoticonSad,
              mdiCloudUpload,
              mdiExclamation,
              mdiEarth,
              mdiEmoticonExcited,
              mdiAutoFix,
              mdiHumanHandsup
          }
        },
        data() {
            return {showDenseTimeline: false, showTimeline: false}
        },
        mounted() {
            this.showDenseTimeline = window.innerWidth < 600;
            this.showTimeline = true;
        },
        computed: {
            isAuthenticated() {
                return this.$store.state.auth.userIsAuthenticated
            }
        }
    }
</script>

<style lang="scss">
    #about-us-timeline {
        .register-button {
            margin-left: 0;
            margin-top: 18px;
        }
    }
</style>
