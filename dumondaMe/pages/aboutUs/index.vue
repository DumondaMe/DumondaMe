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
        <timeline></timeline>
    </div>
</template>

<script>
    import Timeline from '~/components/aboutUs/Timeline';

    export default {
        components: {Timeline},
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