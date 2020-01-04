<template>
    <div id="dumonda-me-header">
        <v-app-bar app :elevate-on-scroll="$vuetify.breakpoint.lgAndUp" :color="getColorOfToolbar" dark dense
                   :flat="$vuetify.breakpoint.mdAndDown">
            <div id="header-container">
                <search-toolbar v-show="$vuetify.breakpoint.mdAndUp || showSearch" @close-search="closeSearch">
                </search-toolbar>
                <div v-show="!($vuetify.breakpoint.mdAndUp || showSearch)" v-if="!showBackNavButton"
                     id="dumonda-me-logo-description">DumondaMe
                </div>
                <v-btn icon @click="navigateBack" v-show="!($vuetify.breakpoint.mdAndUp || showSearch)" v-else>
                    <v-icon>$vuetify.icons.mdiArrowLeft</v-icon>
                </v-btn>
                <v-spacer></v-spacer>
                <v-btn icon v-show="$vuetify.breakpoint.smAndDown && !showSearch" @click="showSearch = true">
                    <v-icon>$vuetify.icons.mdiMagnify</v-icon>
                </v-btn>
                <v-menu bottom left>
                    <template v-slot:activator="{ on }">
                        <v-btn icon v-on="on" v-show="!showSearch">
                            <v-icon>$vuetify.icons.mdiDotsVertical</v-icon>
                        </v-btn>
                    </template>
                    <v-list v-if="isAuthenticated">
                        <v-list-item @click="$emit('show-create-question-dialog')">
                            <v-list-item-title>{{$t("common:toolbar.askQuestion")}}</v-list-item-title>
                        </v-list-item>
                        <v-list-item @click="$emit('show-create-commitment-dialog')">
                            <v-list-item-title>{{$t("common:toolbar.createCommitment")}}</v-list-item-title>
                        </v-list-item>
                        <v-divider></v-divider>
                        <v-list-item @click="$emit('show-import-contacts-dialog')">
                            <v-list-item-title>{{$t("common:toolbar.inviteContacts")}}</v-list-item-title>
                        </v-list-item>
                        <v-list-item @click="$router.push({name: 'setting'})">
                            <v-list-item-title>{{$t("common:toolbar.settings")}}</v-list-item-title>
                        </v-list-item>
                        <v-divider></v-divider>
                        <v-list-item @click="$router.push({name: 'about'})" v-show="$vuetify.breakpoint.width < 1264">
                            <v-list-item-title>{{$t("common:navigation.aboutDumondaMe")}}</v-list-item-title>
                        </v-list-item>
                        <v-list-item @click="logout">
                            <v-list-item-title>{{$t("common:toolbar.logout")}}</v-list-item-title>
                        </v-list-item>
                    </v-list>
                    <v-list v-else>
                        <v-list-item @click="$emit('show-language-dialog')">
                            <v-list-item-title>{{$t("common:toolbar.language")}}</v-list-item-title>
                        </v-list-item>
                        <v-divider></v-divider>
                        <v-list-item @click="$router.push({name: 'register'})">
                            <v-list-item-title>{{$t("common:toolbar.register")}}</v-list-item-title>
                        </v-list-item>
                        <v-list-item @click="$router.push({name: 'login'})">
                            <v-list-item-title>{{$t("common:toolbar.login")}}</v-list-item-title>
                        </v-list-item>
                    </v-list>
                </v-menu>
            </div>
        </v-app-bar>
    </div>
</template>

<script>
    import SearchToolbar from './Search';

    export default {
        components: {SearchToolbar},
        mounted: function () {
            if (this.$store.state.auth.userIsAuthenticated && this.$route.name !== 'notifications') {
                this.$store.dispatch('notification/startCheckNotificationChanged');
            }
        },
        data() {
            return {showSearch: false};
        },
        methods: {
            async logout() {
                try {
                    await this.$store.dispatch('auth/logout');
                    this.$store.dispatch('notification/stopCheckNotificationChanged');
                    this.$store.commit('notification/RESET_NOTIFICATION');
                    this.$store.commit('feedFilter/SET_FILTER_TO_PUBLIC_STATE');
                    this.$store.commit('i18n/SET_LANGUAGES', [this.$store.state.i18n.language]);
                    this.$store.commit('user/SET_IS_HARVESTING_USER', false);
                    this.$store.commit('user/SET_PAGE_VIEW_COUNT', 10);
                    this.$router.push({name: 'index'});
                } catch (e) {
                    this.showError = true;
                }
            },
            closeSearch() {
                if (this.$route.name === 'search') {
                    this.navigateBack();
                }
                this.showSearch = false
            },
            navigateBack() {
                if (document.referrer.includes(process.env.domainUrl)) {
                    this.$router.go(-1);
                } else {
                    this.$router.push({name: 'index'});
                }
            }
        },
        computed: {
            isAuthenticated() {
                return this.$store.state.auth.userIsAuthenticated
            },
            showBackNavButton() {
                return this.$store.state.toolbar.showBackButton
            },
            getColorOfToolbar() {
                if (this.$store.state.user.isHarvestingUser) {
                    return 'secondary'
                }
                return 'primary'
            }
        }
    }
</script>

<style lang="scss">
    #dumonda-me-header {
        #header-container {
            max-width: 900px;
            width: 100%;
            margin: 0 auto;
            display: flex;

            #dumonda-me-logo-description {
                font-weight: 500;
                font-size: 18px;
                line-height: 48px;
            }

            .item-on-mobile {
                @media screen and (min-width: 900px) {
                    display: none;
                }
            }
        }
    }
</style>
