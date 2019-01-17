<template>
    <div id="ely-about-us">
        <h2>{{$t('pages:aboutUs.title')}}</h2>
        <div v-if="selectedLanguage === 'de'">
            <p class="top-text">Wir sind ein engagiertes Team mit dem Ziel, dass die neuen Informationstechnologien zum
                Wohle der Gesellschaft eingesetzt werden. Mit viel fachlichem Know-How und Enthusiasmus haben wir
                DumondaMe verwirklicht. Eine Plattform welche die Entwicklung der Gesellschaft in den Mittelpunkt stellt
                und nicht den Profit. Aus diesem Grund haben wir den gemeinnützigen Verein DumondaMe gegründet, welcher
                als tragendes Gefäss für die Entwicklung und den Betrieb dieses Projektes dienen soll. Die Statuten des
                Vereines findest du <a target="_blank" :href="bylaws">hier.</a>
            </p>
            <div class="about-user">
                <div>
                    <img class="profile-image" :src="imageRoger"/>
                </div>
                <div>
                    <h3 class="name">Roger Waldvogel</h3>
                    <div class="ely-function">Initiator von DumondaMe</div>
                    <p class="about-text">Ich bin eidgenössisch diplomierter Informatikingenieur FH und verfüge
                        über mehrjährige, professionelle Berufserfahrung in der Entwicklung von komplexen
                        Software Systemen. Es ist für mich eine Herzensangelegenheit, dass die neuen
                        Technologien zum Wohle der Allgemeinheit eingesetzt werden. Diese Zielsetzung war
                        für mich die Hauptmotivation, um das Projekt DumondaMe ins Leben zu rufen.
                    </p>
                </div>
            </div>
            <div class="about-user">
                <div>
                    <img class="profile-image" :src="imageRoman"/>
                </div>
                <div>
                    <h3 class="name">Roman Kümin</h3>
                    <div class="ely-function">Vizepräsident von DumondaMe</div>
                    <p class="about-text">Ich bin eidgenössisch diplomierter Informatiker, welcher über 15 Jahren in
                        der Business-Analyse eines der grössten Rückversicherers der Welt tätig war. Ich bin
                        von dem positiven Potenzial der Gesellschaft überzeugt und möchte dessen Entfaltung
                        mit der Unterstützung von DumondaMe fördern.
                    </p>
                </div>
            </div>
            <div class="team-sub-title">Ganzheitliche Projektbegleitung durch
                <a target="_blank" href="https://momoundronja.ch/">momo&ronja</a></div>
            <div class="about-user">
                <div>
                    <img class="profile-image" :src="imageKim"/>
                </div>
                <div>
                    <h3 class="name">Kim Degen</h3>
                    <div class="ely-function"></div>
                    <p class="about-text">
                    </p>
                </div>
            </div>
            <div class="about-user">
                <div>
                    <img class="profile-image" :src="imageJeannine"/>
                </div>
                <div>
                    <h3 class="name">Jeannine Brutschin</h3>
                    <div class="ely-function"></div>
                    <p class="about-text">
                    </p>
                </div>
            </div>
            <div class="team-sub-title">Ehrenamtliche Helfer</div>
            <p>Des weiteren werden wir von vielen Menschen auf ehrenamtlicher Basis unterstützt. An dieser Stelle vielen
                herzlichen Dank für euer freiwilliges Wirken, ohne welches dieses Projekt nicht hätte verwirklicht
                werden können.
            </p>
        </div>
        <div v-else-if="selectedLanguage === 'en'">
            <p class="top-text">DumondaMe is developed and operated by the nonprofit society of the same name. The
                nonprofit society was founded on 21.06.2017. You can find the statutes of the society
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
            },
            imageKim() {
                return `${process.env.staticUrl}/img/about/kim_degen.jpg`
            },
            imageJeannine() {
                return `${process.env.staticUrl}/img/about/jeannine_brutschin.jpg`
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

        .team-sub-title {
            font-size: 20px;
            font-weight: 500;
            margin-bottom: 22px;
        }
    }
</style>