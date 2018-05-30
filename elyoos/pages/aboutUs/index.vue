<template>
    <div id="ely-about-us">
        <div v-if="selectedLanguage === 'de'">
            <p class="top-text">Elyoos wird vom gleichnamigen Verein entwickelt und betrieben. Der Verein wurde am
                21.06.2017 gegründet.
                Die Vereinsstatuten findest du
                <a target="_blank" :href="bylaws">hier.</a>
            </p>
            <div class="about-user">
                <div>
                    <img class="profile-image" :src="imageRoger"/>
                </div>
                <div>
                    <h2 class="name">Roger Waldvogel</h2>
                    <div class="ely-function">Initiator von Elyoos</div>
                    <p class="about-text">Leidenschaftlicher Software Entwickler, Kletterer, Meditierender, (luzider)
                        Träumer.</p>
                </div>
            </div>
            <div class="about-user">
                <div>
                    <img class="profile-image" :src="imageRoman"/>
                </div>
                <div>
                    <h2 class="name">Roman Kümin</h2>
                    <div class="ely-function">Vizepräsident von Elyoos</div>
                    <p class="about-text">Interessiert in Digitalen Währungen und Blockchain, Gartenkräuterhalter.</p>
                </div>
            </div>
        </div>
        <div v-else-if="selectedLanguage === 'en'">
            <p class="top-text">Elyoos is developed and operated by the non-profit association of the same name. The
                association was founded on 21.06.2017. You can find the statutes of the association
                <a target="_blank" :href="bylaws">here.</a>
            </p>
            <div class="about-user">
                <div>
                    <img class="profile-image" :src="imageRoger"/>
                </div>
                <div>
                    <h2 class="name">Roger Waldvogel</h2>
                    <div class="ely-function">Initiator of Elyoos</div>
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
                    <div class="ely-function">Vice President of Elyoos</div>
                    <p class="about-text">Interested in Digital Currencies and Blockchain, Garden Herb Holder.</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
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
        max-width: 600px;
        margin: 0 auto;
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
                img {
                    border-radius: 2px;
                }
            }
            h2 {
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