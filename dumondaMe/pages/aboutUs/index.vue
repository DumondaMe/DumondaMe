<template>
    <div id="ely-about-us">
        <h2>{{$t('pages:aboutUs.team.title')}}</h2>
        <div v-if="selectedLanguage === 'de'">
            <p class="top-text">DumondaMe wird vom gleichnamigen Verein entwickelt und betrieben. Der Verein wurde am
                21.06.2017 gegründet.
                Die Vereinsstatuten findest du
                <a target="_blank" :href="bylaws">hier.</a>
            </p>
            <div class="about-user">
                <div>
                    <img class="profile-image" :src="imageRoger"/>
                </div>
                <div>
                    <h3 class="name">Roger Waldvogel</h3>
                    <div class="ely-function">Initiator von DumondaMe</div>
                    <p class="about-text">Leidenschaftlicher Software Entwickler, Kletterer, Meditierender, (luzider)
                        Träumer.</p>
                </div>
            </div>
            <div class="about-user">
                <div>
                    <img class="profile-image" :src="imageRoman"/>
                </div>
                <div>
                    <h3 class="name">Roman Kümin</h3>
                    <div class="ely-function">Vizepräsident von DumondaMe</div>
                    <p class="about-text">Interessiert in Digitalen Währungen und Blockchain, Gartenkräuterhalter.</p>
                </div>
            </div>
            <p>Des weiteren unterstützten uns <a target="_blank" href="https://momoundronja.ch/">momo&ronja</a>
                tatkräftig beim Aufbau dieser Plattform.</p>
        </div>
        <div v-else-if="selectedLanguage === 'en'">
            <p class="top-text">DumondaMe is developed and operated by the non-profit association of the same name. The
                association was founded on 21.06.2017. You can find the statutes of the association
                <a target="_blank" :href="bylaws">here.</a>
            </p>
            <div class="about-user">
                <div>
                    <img class="profile-image" :src="imageRoger"/>
                </div>
                <div>
                    <h2 class="name">Roger Waldvogel</h2>
                    <div class="ely-function">Initiator of DumondaMe</div>
                    <p class="about-text">Passionate Software Developer, Climber, Meditating, (lucid)
                        Dreamer.</p>
                </div>
            </div>
            <div class="about-user">
                <div>
                    <img class="profile-image" :src="imageRoman"/>
                </div>
                <div>
                    <h2 class="name">Roman Kümin</h2>
                    <div class="ely-function">Vice President of DumondaMe</div>
                    <p class="about-text">Interested in Digital Currencies and Blockchain, Garden Herb Holder.</p>
                </div>
            </div>
            <p>Furthermore, <a target="_blank" href="https://momoundronja.ch/">momo&ronja</a>
                actively supported us in building this platform.</p>
        </div>
        <h2 class="subtitle">{{$t('pages:aboutUs.history.title')}}</h2>
        <v-timeline align-top id="dumonda-me-history-timeline"
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
            <timeline-element color="green lighten-1" icon="mdi-earth"
                              :date="$t('pages:aboutUs.history.helloWorld.date')"
                              :timeline-title="$t('pages:aboutUs.history.helloWorld.title')"
                              :timeline-text="$t('pages:aboutUs.history.helloWorld.text')">
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
    import TimelineElement from '~/components/aboutUs/TimelineElement.vue';

    export default {
        components: {TimelineElement},
        data() {
            return {showDenseTimeline: false}
        },
        mounted() {
            this.showDenseTimeline = window.innerWidth < 600;
        },
        computed: {
            selectedLanguage() {
                return this.$store.state.i18n.language
            },
            bylaws() {
                return `${process.env.staticUrl}/pdf/statuten.pdf`
            },
            imageRoger() {
                return `${process.env.staticUrl}/img/about/roger_waldvogel.jpg`
            },
            imageRoman() {
                return `${process.env.staticUrl}/img/about/roman_kuemin.jpg`
            }
        }
    }
</script>

<style lang="scss">
    #ely-about-us {
        max-width: 950px;
        margin: 0 auto 24px auto;
        @media screen and (max-width: $xs) {
            margin-top: 18px;
            padding: 0 16px;
        }
        h2 {
            font-size: 32px;
            color: #333;
            margin-bottom: 20px;
            @media screen and (max-width: $xs) {
                font-size: 28px;
                line-height: 34px;
                margin-bottom: 18px;
            }
        }
        h2.subtitle {
            margin-top: 58px;
            margin-bottom: 0;
        }
        .top-text {
            margin-bottom: 40px;
        }
        p {
            font-weight: 300;
            font-size: 16px;
            line-height: 24px;
        }
        .about-user {
            display: flex;
            margin-bottom: 22px;
            .profile-image {
                margin-right: 18px;
                @media screen and (max-width: $xs) {
                    width: 80px;
                    height: 80px;
                }
                img {
                    border-radius: 2px;
                }
            }
            h3 {
                line-height: 18px;
                font-size: 18px;
                color: $primary-color;

            }
            .ely-function {
                font-size: 14px;
                font-weight: 300;
                margin-bottom: 6px;
            }
        }
    }
</style>