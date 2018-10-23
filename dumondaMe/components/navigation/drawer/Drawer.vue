<template>
    <div id="navigation-drawer">
        <div v-if="isAuthenticated" class="user-navigation">
            <div class="drawer-navigation-element">
                <nuxt-link :to="{name: 'user'}">
                    <v-icon>mdi-account</v-icon>
                    <span class="navigation-text">{{$t("common:navigation.yourProfile")}}</span>
                </nuxt-link>
            </div>
            <div class="drawer-navigation-element">
                <nuxt-link :to="{name: 'user-notifications'}">
                    <v-badge color="secondary" v-model="showNotification" right overlap>
                        <v-icon>mdi-bell</v-icon>
                        <span slot="badge">{{numberOfNotifications}}</span>
                    </v-badge>
                    <span class="navigation-text">{{$t("common:navigation.notification")}}</span>
                </nuxt-link>
            </div>
        </div>
        <div v-else>
            <v-btn outline color="primary" class="navigation-button-full-width"
                   @click="$router.push({name: 'login'})">
                {{$t('common:button.login')}}
            </v-btn>
            <v-btn color="primary" class="navigation-button-full-width"
                   @click="$router.push({name: 'register'})">
                {{$t('common:button.register')}}
            </v-btn>
        </div>
        <v-divider></v-divider>
        <div class="common-navigation">
            <div class="drawer-navigation-element">
                <nuxt-link :to="{name: 'vision'}">
                    <v-icon>mdi-label</v-icon>
                    <span class="navigation-text">{{$t("pages:footer.vision")}}</span>
                </nuxt-link>
            </div>
            <div class="drawer-navigation-element">
                <nuxt-link :to="{name: 'aboutUs'}">
                    <v-icon>mdi-label</v-icon>
                    <span class="navigation-text">{{$t("pages:footer.aboutUs")}}</span>
                </nuxt-link>
            </div>
            <div class="drawer-navigation-element">
                <nuxt-link :to="{name: 'faq'}">
                    <v-icon>mdi-label</v-icon>
                    <span class="navigation-text">{{$t("pages:footer.faq")}}</span>
                </nuxt-link>
            </div>
            <div class="drawer-navigation-element">
                <nuxt-link :to="{name: 'terms'}">
                    <v-icon>mdi-label</v-icon>
                    <span class="navigation-text">{{$t("pages:footer.terms")}}</span>
                </nuxt-link>
            </div>
            <div class="drawer-navigation-element">
                <nuxt-link :to="{name: 'privacy'}">
                    <v-icon>mdi-label</v-icon>
                    <span class="navigation-text">{{$t("pages:footer.privacy")}}</span>
                </nuxt-link>
            </div>
            <!--<div class="drawer-navigation-element">
                <nuxt-link :to="{name: 'contact'}">
                    <v-icon>mdi-label</v-icon>
                    <span class="navigation-text">{{$t("pages:footer.contact")}}</span>
                </nuxt-link>
            </div>-->
        </div>
        <div v-if="!isAuthenticated" class="bottom-navigation">
            <v-divider></v-divider>
            <div class="drawer-navigation-element">
                <v-icon @click="setLanguage()">mdi-web</v-icon>
                <span class="navigation-text" @click="setLanguage()">{{$t("common:navigation.language")}}</span>
            </div>
        </div>
        <div v-if="isAuthenticated" class="bottom-navigation">
            <v-divider></v-divider>
            <div class="bottom-inner-navigation">
                <div class="drawer-navigation-element">
                    <nuxt-link :to="{name: 'setting'}">
                        <v-icon>mdi-settings</v-icon>
                        <span class="navigation-text">{{$t("common:navigation.settings")}}</span>
                    </nuxt-link>
                </div>
                <div class="drawer-navigation-element">
                    <v-icon @click="logout">mdi-logout-variant</v-icon>
                    <span class="navigation-text" @click="logout">{{$t("common:navigation.logout")}}</span>
                </div>
            </div>
        </div>
        <language-dialog v-if="showChangeLanguage" @close-dialog="showChangeLanguage = false">
        </language-dialog>
        <v-snackbar top v-model="showError" color="error" :timeout="0">{{$t("common:error.unknown")}}
            <v-btn dark flat @click="showError = false">{{$t("common:button.close")}}</v-btn>
        </v-snackbar>
    </div>
</template>

<script>
    import {mapGetters} from 'vuex';
    import LanguageDialog from '~/components/setting/dialog/LanguageDialog';

    export default {
        name: "Drawer",
        data() {
            return {showError: false, showChangeLanguage: false}
        },
        components: {LanguageDialog},
        computed: {
            isAuthenticated() {
                return this.$store.state.auth.userIsAuthenticated
            },
            showNotification() {
                return this.numberOfNotifications > 0;
            },
            ...mapGetters({
                numberOfNotifications: 'notification/numberOfNotifications'
            })
        },
        methods: {
            async logout() {
                try {
                    await this.$store.dispatch('auth/logout');
                    this.$store.dispatch('notification/stopCheckNotificationChanged');
                    this.$store.commit('notification/RESET_NOTIFICATION');
                    this.$store.commit('feedFilter/SET_FILTER_TO_PUBLIC_STATE');
                    await this.$store.dispatch('feed/getFeed');
                    this.$router.push({name: 'index'});
                    this.$emit('close-drawer');
                } catch (e) {
                    this.showError = true;
                }
            },
            setLanguage() {
                this.showChangeLanguage = true;
                this.$emit('close-drawer');
            }
        }
    }
</script>

<style lang="scss">
    #navigation-drawer {
        padding: 32px 16px 8px 16px;
        .navigation-button-full-width {
            margin: 0 0 18px 0;
            width: 100%;
        }
        .user-navigation {
            margin-bottom: 8px;
        }
        .common-navigation {
            margin-top: 14px;
        }
        .bottom-navigation {
            margin-top: 12px;
            .bottom-inner-navigation {
                margin-top: 8px;
            }
        }
        .drawer-navigation-element {
            padding: 8px 0;
            display: flex;
            a {
                text-decoration: none;
                display: flex;
            }
            .navigation-text {
                cursor: pointer;
                text-decoration: none;
                margin-left: 28px;
                font-size: 16px;
                line-height: 24px;
                height: 24px;
                color: $primary-text;
            }
        }
    }
</style>