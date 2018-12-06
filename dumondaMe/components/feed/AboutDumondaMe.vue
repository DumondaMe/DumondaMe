<template>
    <div class="about-dumonda-me-container">
        <div class="ely-card about-dumonda-me-card">
            <div class="about-title">{{$t('pages:feeds.aboutDumondaMeInfos.vision.title')}}</div>
            <img :src="welcomeImage" class="desktop-welcome-image"/>
            <img :src="welcomeImageMobile" class="mobile-welcome-image"/>
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
            <div class="about-description">{{$t('pages:feeds.aboutDumondaMeInfos.aboutUs.description')}}</div>
            <v-btn outline color="primary" @click="$router.push({name: 'aboutUs'})">
                {{$t('pages:feeds.aboutDumondaMeInfos.aboutUs.actionButton')}}
            </v-btn>
        </div>
        <div class="ely-card about-dumonda-me-card">
            <div class="about-title">{{$t('pages:feeds.aboutDumondaMeInfos.register.title')}}</div>
            <div class="about-description">{{$t('pages:feeds.aboutDumondaMeInfos.register.description')}}</div>
            <v-btn color="secondary" @click="$router.push({name: 'register'})">
                {{$t('pages:feeds.aboutDumondaMeInfos.register.actionButton')}}
            </v-btn>
        </div>
    </div>
</template>

<script>
    export default {

        computed: {
            welcomeImage() {
                return `${process.env.staticUrl}/img/welcome/welcome2.jpg`;
            },
            welcomeImageMobile() {
                return `${process.env.staticUrl}/img/welcome/welcome2_mobile.jpg`;
            }
        }
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
        }
    }
</style>
