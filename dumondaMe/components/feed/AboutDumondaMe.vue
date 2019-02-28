<template>
    <div class="about-dumonda-me-container">
        <div class="ely-card about-dumonda-me-card">
            <div class="about-title">{{$t('pages:feeds.aboutDumondaMeInfos.vision.title')}}</div>
            <div class="youtube-video-container" ref="youtubeContainer">
                <div v-if="showYoutubePreviewImage" @click="showYoutubePreviewImage = false">
                    <img :src="welcomeImage" :srcset="welcome2xImage" class="desktop-welcome-image"/>
                    <img :src="welcomeImageMobile" class="mobile-welcome-image"/>
                    <img :src="imageYoutube" class="youtube-icon"/>
                </div>
                <div v-else>
                    <iframe :width="youtubeWidth" :height="youtubeHeight"
                            src="https://www.youtube.com/embed/hcCvaH0RJj4?rel=0&autoplay=1" frameBorder="0"
                            allow="autoplay"></iframe>
                    <div class="mobile-autoplay-warning">
                        {{$t('pages:feeds.aboutDumondaMeInfos.vision.autoplayWarning')}}
                    </div>
                </div>
            </div>
            <div class="about-description">{{$t('pages:feeds.aboutDumondaMeInfos.vision.description')}}</div>
            <v-btn outline color="primary" @click="$router.push({name: 'faq'})">
                {{$t('pages:feeds.aboutDumondaMeInfos.vision.actionButton')}}
            </v-btn>
            <v-btn outline color="primary" @click="$router.push({name: 'vision'})">
                {{$t('pages:feeds.aboutDumondaMeInfos.vision.actionButtonVision')}}
            </v-btn>
        </div>
        <div class="ely-card about-dumonda-me-card">
            <div class="about-title">{{$t('pages:feeds.aboutDumondaMeInfos.aboutUs.title')}}</div>
            <img :src="teamImage" :srcset="team2xImage" class="team-image">
            <div class="about-description">{{$t('pages:feeds.aboutDumondaMeInfos.aboutUs.description')}}</div>
            <v-btn outline color="primary" @click="$router.push({name: 'aboutUs'})">
                {{$t('pages:feeds.aboutDumondaMeInfos.aboutUs.actionButton')}}
            </v-btn>
        </div>
        <div class="ely-card about-dumonda-me-card" v-if="isEnglish">
            <div class="about-title">Dear English speaking user</div>
            <div class="about-description">At the moment we are still focusing our content on the German-speaking area.
                That’s why only few English-speaking content exists for now. However, you can still create an account
                and will be informed as soon as we start publishing English language content.
            </div>
            <v-btn outline color="primary" @click="changeLanguage">
                Change to German
            </v-btn>
        </div>
        <div class="ely-card about-dumonda-me-card">
            <div class="about-title">{{$t('pages:feeds.aboutDumondaMeInfos.register.title')}}</div>
            <img v-lazy="signUpImage" :data-srcset="signUp2xImage" class="sign-up-image">
            <div class="about-description">{{$t('pages:feeds.aboutDumondaMeInfos.register.description')}}</div>
            <v-btn color="secondary" @click="$router.push({name: 'register'})">
                {{$t('common:button.register')}}
            </v-btn>
            <v-btn color="primary" outline @click="$router.push({name: 'login'})" class="mobile-login-button">
                {{$t('pages:feeds.aboutDumondaMeInfos.register.loginButton')}}
            </v-btn>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {showYoutubePreviewImage: true}
        },
        computed: {
            welcomeImage() {
                return `${process.env.staticUrl}/img/landingPage/welcome.jpg`;
            },
            welcome2xImage() {
                return `${process.env.staticUrl}/img/landingPage/welcome_2x.jpg 2x`;
            },
            welcomeImageMobile() {
                return `${process.env.staticUrl}/img/landingPage/welcome_mobile.jpg`;
            },
            signUpImage() {
                return `${process.env.staticUrl}/img/landingPage/signUp.jpg`;
            },
            signUp2xImage() {
                return `${process.env.staticUrl}/img/landingPage/signUp.jpg 500w, ` +
                    `${process.env.staticUrl}/img/landingPage/signUp_2x.jpg 1000w`;
            },
            teamImage() {
                return `${process.env.staticUrl}/img/landingPage/team.jpg`;
            },
            team2xImage() {
                return `${process.env.staticUrl}/img/landingPage/team_2x.jpg 2x`;
            },
            imageYoutube() {
                return `${process.env.staticUrl}/img/youtube.png`;
            },
            isEnglish() {
                return this.$store.state.i18n.language === 'en';
            },
            youtubeWidth() {
                return this.$refs.youtubeContainer.clientWidth;
            },
            youtubeHeight() {
                return this.$refs.youtubeContainer.clientWidth * 0.6;
            }
        },
        methods: {
            changeLanguage() {
                this.$store.dispatch('i18n/setLanguage', {language: 'de'});
            }
        },
    }
</script>

<style lang="scss">
    .about-dumonda-me-container {
        margin-top: 58px;
        @media screen and (min-width: $xs) {
            margin-top: 32px;
        }

        .about-dumonda-me-card {
            @media screen and (min-width: $xs) {
                margin-bottom: 18px;
            }

            .youtube-video-container {
                position: relative;
                cursor: pointer;

                img {
                    width: 100%;
                    border-radius: 4px;
                    margin-bottom: 8px;
                }

                .mobile-welcome-image {
                    max-width: 350px;
                    @media screen and (min-width: 400px) {
                        display: none;
                    }
                }

                .desktop-welcome-image {
                    @media screen and (max-width: 400px) {
                        display: none;
                    }
                }

                .mobile-autoplay-warning {
                    color: $warning;
                    margin-bottom: 8px;
                    @media screen and (min-width: $xs) {
                        display: none;
                    }
                }

                .youtube-icon {
                    position: absolute;
                    width: 70px;
                    margin-top: -25px;
                    margin-left: -35px;
                    top: 50%;
                    left: 50%;

                    @media screen and (max-width: $xs) {
                        width: 50px;
                        margin-top: -22px;
                        margin-left: -25px;
                    }
                }
            }

            .about-title {
                font-weight: 500;
                margin-bottom: 12px;
            }

            .about-description {
                font-weight: 300;
            }

            button {
                margin: 12px 18px 0 0;
                @media screen and (max-width: $xs) {
                    margin-bottom: 12px;
                }
            }
            .mobile-login-button {
                @media screen and (max-width: $xs) {
                    margin-top: 0;
                }
            }

            .sign-up-image {
                width: 100%;
                border-radius: 4px;
                margin-bottom: 8px;
            }

            .team-image {
                border-radius: 4px;
                width: 100%;
            }
        }
    }
</style>
