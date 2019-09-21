<template>
    <v-app>
        <v-navigation-drawer v-if="isNotPublicStartPage" app>
            <dumonda-me-navigation-drawer @show-create-question-dialog="openAskQuestionDialog"
                                          @show-create-answer-dialog="openCreateAnswerDialog">
            </dumonda-me-navigation-drawer>
        </v-navigation-drawer>
        <v-content v-if="isNotPublicStartPage">
            <v-container fluid>
                <dumonda-me-toolbar @show-language-dialog="showChangeLanguage = true"
                                    @show-create-commitment-dialog="showCreateCommitment = true"
                                    @show-create-question-dialog="openAskQuestionDialog"
                                    @show-import-contacts-dialog="showImportContact = true">
                </dumonda-me-toolbar>
                <div id="dumonda-me-content">
                    <div id="dumonda-me-inner-content">
                        <nuxt/>
                    </div>
                </div>
            </v-container>
        </v-content>

        <bottom-nav v-if="isNotPublicStartPage"></bottom-nav>

        <welcome-dialog v-if="showWelcomeDialog" @close-dialog="showInfoDialog = false"></welcome-dialog>
        <cookie-privacy-read-info></cookie-privacy-read-info>
        <public-landing-page v-if="!isNotPublicStartPage"></public-landing-page>

        <language-dialog v-if="showChangeLanguage" @close-dialog="showChangeLanguage = false">
        </language-dialog>
        <create-commitment-dialog v-if="showCreateCommitment" @close-dialog="showCreateCommitment = false">
        </create-commitment-dialog>
        <create-question-dialog v-if="showCreateQuestion" @close-dialog="showCreateQuestion = false">
        </create-question-dialog>
        <v-dialog v-model="showCreateAnswer" scrollable persistent max-width="770px"
                  :fullscreen="$vuetify.breakpoint.xsOnly">
            <create-answer-dialog @close-dialog="showCreateAnswer = false">
            </create-answer-dialog>
        </v-dialog>
        <import-contact-dialog v-if="showImportContact" @close-dialog="showImportContact = false">
        </import-contact-dialog>
        <login-required-dialog v-if="showLoginRequired" @close-dialog="showLoginRequired = false">
        </login-required-dialog>
    </v-app>
</template>

<script>
    import DumondaMeToolbar from '~/components/navigation/toolbar/Toolbar';
    import DumondaMeNavigationDrawer from '~/components/navigation/drawer/Drawer';
    import BottomNav from '~/components/navigation/footer/BottomNav';
    import WelcomeDialog from '~/components/info/welcomeDialog/WelcomeDialog';
    import PublicLandingPage from '~/components/publicLandingPage/LandingPage';
    import cookiePrivacyReadInfo from '~/components/info/cookiePrivacyReadInfo';
    import LanguageDialog from '~/components/setting/dialog/LanguageDialog';
    import CreateCommitmentDialog from '~/components/commitment/dialog/CreateDialog.vue'
    import CreateQuestionDialog from '~/components/question/dialog/CreateQuestionDialog.vue'
    import CreateAnswerDialog from '~/components/question/answer/dialog/CreateDialog.vue';
    import ImportContactDialog from '~/components/import/ImportContactDialog'
    import LoginRequiredDialog from '~/components/common/dialog/LoginRequired.vue';

    export default {
        components: {
            DumondaMeToolbar, DumondaMeNavigationDrawer, WelcomeDialog, PublicLandingPage,
            cookiePrivacyReadInfo, LanguageDialog, CreateCommitmentDialog, CreateQuestionDialog, ImportContactDialog,
            LoginRequiredDialog, CreateAnswerDialog, BottomNav
        },
        head() {
            return {
                htmlAttrs: {
                    lang: this.$store.state.i18n.language
                },
                meta: [
                    {hid: 'description', name: 'description', content: this.$t('common:meta.description')},
                    {hid: 'keywords', name: 'keywords', content: this.$t('common:meta.keywords')},
                    {hid: 'og:description', property: 'og:description', content: this.$t('common:meta.description')},
                    {hid: 'og:title', property: 'og:title', content: this.$t('common:navigation.home')},
                    {
                        hid: 'twitter:description', property: 'twitter:description',
                        content: this.$t('common:meta.description')
                    },
                    {hid: 'twitter:title', property: 'twitter:title', content: this.$t('common:navigation.home')}
                ]
            }
        },
        data() {
            return {
                showInfoDialog: false, showChangeLanguage: false, showCreateCommitment: false,
                showCreateQuestion: false, showCreateAnswer: false, showLoginRequired: false, showImportContact: false
            };
        },
        mounted() {
            this.showInfoDialog = true;
        },
        methods: {
            openAskQuestionDialog() {
                if (this.isAuthenticated) {
                    this.showCreateQuestion = true;
                } else {
                    this.showLoginRequired = true;
                }
            },
            openCreateAnswerDialog() {
                if (this.isAuthenticated) {
                    this.showCreateAnswer = true;
                } else {
                    this.showLoginRequired = true;
                }
            }
        },
        computed: {
            isAuthenticated() {
                return this.$store.state.auth.userIsAuthenticated
            },
            showWelcomeDialog() {
                return this.showInfoDialog &&
                    (this.$store.state.user.infoState === 0 || !this.$store.state.user.infoState) &&
                    this.$store.state.auth.userIsAuthenticated && this.$route.name !== 'auth';
            },
            isNotPublicStartPage() {
                return !(this.$route.name === 'index' && !this.$store.state.auth.userIsAuthenticated);
            }
        }
    }
</script>

<style lang="scss">
    html {
        font-family: "Source Sans Pro", -apple-system, BlinkMacSystemFont, Roboto, Arial, sans-serif;
        background-color: $background-normal;
        font-size: 16px;
        -ms-text-size-adjust: 100%;
        -webkit-text-size-adjust: 100%;
        -moz-osx-font-smoothing: grayscale;
        -webkit-font-smoothing: antialiased;
        box-sizing: border-box;
        min-height: 100%;
        height: 100%;
        @media screen and (max-width: $xs) {
            background-color: white;
        }
    }

    body {
        #__layout {
            .v-application {
                background-color: $background-normal;
                @media screen and (max-width: $xs) {
                    background-color: white;
                }

                .container.container--fluid {
                    @media screen and (max-width: $md) {
                        padding-left: 0;
                        padding-right: 0;
                        padding-top: 0;
                    }
                }

                #dumonda-me-content {
                    min-height: inherit;
                    height: inherit;

                    #dumonda-me-inner-content {
                        max-width: 900px;
                        width: 100%;
                        margin: 0 auto;
                        @media screen and (max-width: $md) {
                            padding-left: 14px;
                            padding-right: 14px;
                        }
                        @media screen and (max-width: $xs) {
                            padding-left: 0;
                            padding-right: 0;
                        }
                    }
                }
            }
        }
    }

    .v-dialog {
        @media screen and (max-width: 500px) {
            width: 100%;
            min-width: 100%
        }

        .v-card {
            .v-card__text {
                padding-top: 16px;
            }

            .layout.row {
                margin-right: 0;
                margin-left: 0;
            }

            .v-card__actions {
                padding-left: 16px;
                padding-right: 16px;
            }
        }
    }

    *, *:before, *:after {
        box-sizing: border-box;
        margin: 0;
        text-transform: none !important;
    }

    #ely-footer {
        @media screen and (max-width: $xs) {
            display: none;
        }
    }
</style>
