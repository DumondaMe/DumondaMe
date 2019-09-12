<template>
    <div id="navigation-drawer">
        <div v-if="isAuthenticated" class="user-navigation">
            <div class="drawer-navigation-element">
                <v-icon @click="$emit('show-create-question-dialog')">mdi-help-circle-outline</v-icon>
                <span class="navigation-text" @click="$emit('show-create-question-dialog')">
                    {{$t("common:navigation.askQuestion")}}</span>
            </div>
            <div class="drawer-navigation-element">
                <v-icon @click="$emit('show-create-commitment-dialog')">mdi-human-handsup</v-icon>
                <span class="navigation-text" @click="$emit('show-create-commitment-dialog')">
                    {{$t("common:navigation.createCommitment")}}</span>
            </div>
            <div class="drawer-navigation-element">
                <v-icon @click="$emit('show-import-contacts-dialog')">mdi-account-multiple-plus</v-icon>
                <span class="navigation-text" @click="$emit('show-import-contacts-dialog')">
                    {{$t("common:navigation.inviteContacts")}}</span>
            </div>
        </div>
        <div v-else>
            <v-btn outlined color="primary" class="navigation-button-full-width"
                   @click="$router.push({name: 'login'})">
                {{$t('common:button.login')}}
            </v-btn>
            <v-btn color="secondary" class="navigation-button-full-width register-button"
                   @click="$router.push({name: 'register'})">
                {{$t('common:button.register')}}
            </v-btn>
            <v-divider></v-divider>
            <div class="drawer-navigation-element">
                <nuxt-link :to="{name: 'index'}">
                    <v-icon>mdi-home</v-icon>
                    <span class="navigation-text">{{$t("common:navigation.home")}}</span>
                </nuxt-link>
            </div>
            <div class="drawer-navigation-element">
                <v-icon @click="$emit('show-language-dialog')">mdi-web</v-icon>
                <span class="navigation-text" @click="$emit('show-language-dialog')">
                    {{$t("common:navigation.language")}}</span>
            </div>
        </div>
        <v-divider></v-divider>
        <div class="common-navigation">
            <div class="drawer-navigation-element" v-if="isAuthenticated">
                <nuxt-link :to="{name: 'index'}">
                    <v-icon>mdi-home</v-icon>
                    <span class="navigation-text">{{$t("common:navigation.home")}}</span>
                </nuxt-link>
            </div>
            <div class="drawer-navigation-element">
                <nuxt-link :to="{name: 'vision'}">
                    <v-icon>mdi-rocket</v-icon>
                    <span class="navigation-text">{{$t("pages:footer.vision")}}</span>
                </nuxt-link>
            </div>
            <div class="drawer-navigation-element">
                <nuxt-link :to="{name: 'aboutUs'}">
                    <v-icon>mdi-account-multiple</v-icon>
                    <span class="navigation-text">{{$t("pages:footer.aboutUs")}}</span>
                </nuxt-link>
            </div>
            <div class="drawer-navigation-element">
                <nuxt-link :to="{name: 'contact'}">
                    <v-icon>mdi-account-box-outline</v-icon>
                    <span class="navigation-text">{{$t("pages:footer.contact")}}</span>
                </nuxt-link>
            </div>
            <div class="drawer-navigation-element">
                <nuxt-link :to="{name: 'faq'}">
                    <v-icon>mdi-help</v-icon>
                    <span class="navigation-text">{{$t("pages:footer.faq")}}</span>
                </nuxt-link>
            </div>
            <div class="drawer-navigation-element">
                <nuxt-link :to="{name: 'donation'}">
                    <v-icon>mdi-gift</v-icon>
                    <span class="navigation-text">{{$t("pages:footer.donate")}}</span>
                </nuxt-link>
            </div>
            <div class="drawer-navigation-element">
                <nuxt-link :to="{name: 'terms'}">
                    <v-icon>mdi-library</v-icon>
                    <span class="navigation-text">{{$t("pages:footer.terms")}}</span>
                </nuxt-link>
            </div>
            <div class="drawer-navigation-element">
                <nuxt-link :to="{name: 'privacy'}">
                    <v-icon>mdi-security-lock</v-icon>
                    <span class="navigation-text">{{$t("pages:footer.privacy")}}</span>
                </nuxt-link>
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
        <v-snackbar top v-model="showError" color="error" :timeout="0">{{$t("common:error.unknown")}}
            <v-btn dark text @click="showError = false">{{$t("common:button.close")}}</v-btn>
        </v-snackbar>
    </div>
</template>

<script>
    import {mapGetters} from 'vuex';

    export default {
        name: "Drawer",
        data() {
            return {
                showError: false
            }
        },
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
                    this.$store.commit('i18n/SET_LANGUAGES', [this.$store.state.i18n.language]);
                    await this.$store.dispatch('feed/getFeed');
                    this.$router.push({name: 'index'});
                    this.$emit('close-drawer');
                } catch (e) {
                    this.showError = true;
                }
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

        .register-button {
            margin-bottom: 38px;
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