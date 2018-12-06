<template>
    <div>
        <no-ssr>
            <div id="cookie-privacy-read-info" v-if="showInfo">
                <div id="cookie-privacy-read-info-container">
                    <div class="privacy-info-text">
                        <span>{{$t('common:cookiePrivacyInfo.info1')}} </span>
                        <nuxt-link :to="{name: 'privacy'}">{{$t('common:cookiePrivacyInfo.infoLinkPrivacy')}}
                        </nuxt-link>
                        <span> {{$t('common:cookiePrivacyInfo.info2')}}</span>
                    </div>
                    <v-btn color="secondary" @click="acceptCookies">
                        {{$t('common:button.ok')}}
                    </v-btn>
                </div>
            </div>
        </no-ssr>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                showCookieWarning: false
            }
        },
        mounted() {
            this.showCookieWarning = true;
            if (document.cookie) {
                let warningSet = this.getCookie("privacyWarning");
                if (warningSet === "true") {
                    this.showCookieWarning = false;
                }
            } else if (this.$store.state.auth.userIsAuthenticated) {
                this.acceptCookies();
            }
        },
        computed: {
            showInfo() {
                return this.showCookieWarning && !this.$store.state.auth.userIsAuthenticated;
            }
        },
        methods: {
            acceptCookies() {
                document.cookie = "privacyWarning=true; expires=Fri, 31 Dec 2030 23:59:59 UTC;";
                this.showCookieWarning = false;
            },
            getCookie(cname) {
                let name = cname + "=";
                let ca = document.cookie.split(";");
                for (let i = 0; i < ca.length; i++) {
                    let c = ca[i];
                    while (c.charAt(0) === " ") {
                        c = c.substring(1);
                    }
                    if (c.indexOf(name) === 0) {
                        return c.substring(name.length, c.length);
                    }
                }
                return "";
            }
        },
    }
</script>

<style lang="scss">
    #cookie-privacy-read-info {
        position: fixed;
        z-index: 100;
        background-color: #212121;
        opacity: 0.9;
        height: 50px;
        bottom: 0;
        right: 0;
        left: 0;
        padding-left: 8px;

        @media screen and (max-width: $xs) {
            height: 160px;
            padding-top: 8px;
            font-size: 14px;
        }

        #cookie-privacy-read-info-container {
            max-width: 950px;
            width: 100%;
            height: 100%;
            margin: 0 auto;
            display: flex;
            @media screen and (max-width: $xs) {
                display: block;
            }

            .privacy-info-text {
                color: white;
                opacity: 1;
                z-index: 101;

                a {
                    color: $secondary-color;
                    font-weight: 500;
                }
            }

            button {
                @media screen and (max-width: $xs) {
                    margin-top: 18px;
                    margin-left: 0;
                }
            }
        }
    }
</style>
