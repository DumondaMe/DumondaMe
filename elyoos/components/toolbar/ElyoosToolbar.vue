<template>
    <div id="elyoos-header">
        <div id="header-container">
            <div id="elyoos-logo" hidden-xs-only>
                <img :src="getLogoUrl"/>
            </div>
            <div class="header-nav" v-if="isAuthenticated">
                <v-menu bottom left>
                    <v-btn icon slot="activator">
                        <v-icon>more_vert</v-icon>
                    </v-btn>
                    <v-list>
                        <v-list-tile @click="$router.push({name: 'setting'})">
                            <v-list-tile-title>{{$t("pages:toolbar.settings")}}</v-list-tile-title>
                        </v-list-tile>
                        <v-list-tile @click="$router.push({name: 'user'})">
                            <v-list-tile-title>{{$t("pages:toolbar.yourProfile")}}</v-list-tile-title>
                        </v-list-tile>
                        <v-divider></v-divider>
                        <v-list-tile  @click="showCreateQuestion = true">
                            <v-list-tile-title>{{$t("pages:toolbar.createQuestion")}}</v-list-tile-title>
                        </v-list-tile>
                        <v-list-tile @click="showCreateCommitment = true">
                            <v-list-tile-title>{{$t("pages:toolbar.createCommitment")}}</v-list-tile-title>
                        </v-list-tile>
                        <v-divider></v-divider>
                        <v-list-tile @click="">
                            <v-list-tile-title>{{$t("pages:toolbar.aboutElyoos")}}</v-list-tile-title>
                        </v-list-tile>
                        <v-list-tile @click="logout()">
                            <v-list-tile-title>{{$t("pages:toolbar.logout")}}</v-list-tile-title>
                        </v-list-tile>
                    </v-list>
                </v-menu>
            </div>
            <div class="header-nav" v-else>
                <v-btn outline v-on:click="$router.push({name: 'login'})">{{$t("common:toolbar.login")}}</v-btn>
            </div>
            <div class="header-nav" v-if="!isAuthenticated">
                <v-menu bottom>
                    <v-btn outline slot="activator">
                        {{selectedLanguage.description}}
                    </v-btn>
                    <v-list>
                        <v-list-tile @click="changeLanguage(lang.key)" v-for="lang in getLanguages" :key="lang.key">
                            <v-list-tile-title>{{lang.description}}</v-list-tile-title>
                        </v-list-tile>
                    </v-list>
                </v-menu>
            </div>
            <div class="header-nav" v-if="isAuthenticated">
                <v-btn flat icon>
                    <v-icon>notifications_none</v-icon>
                </v-btn>
            </div>
            <div class="header-nav">
                <v-btn flat icon v-on:click="$router.push({name: 'index'})"
                       :class="{active: $route.path === '/'}">
                    <v-icon>home</v-icon>
                </v-btn>
            </div>
        </div>
        <create-commitment-dialog v-if="showCreateCommitment" @close-dialog="showCreateCommitment = false">
        </create-commitment-dialog>
        <create-question-dialog v-if="showCreateQuestion" @close-dialog="showCreateQuestion = false">
        </create-question-dialog>
    </div>
</template>

<script>
    import CreateCommitmentDialog from '~/components/commitment/create/Dialog.vue'
    import CreateQuestionDialog from '~/components/question/dialog/CreateQuestionDialog.vue'

    export default {
        data() {
            return {showCreateCommitment: false, showCreateQuestion: false}
        },
        components: {CreateCommitmentDialog, CreateQuestionDialog},
        computed: {
            isAuthenticated() {
                return this.$store.state.auth.userIsAuthenticated
            },
            getLanguages() {
                return this.$store.state.i18n.languages
            },
            selectedLanguage() {
                return this.$store.state.i18n.languages.find(lang => lang.key === this.$store.state.i18n.language);
            },
            getLogoUrl() {
                return `${process.env.staticUrl}/img/logo.png`;
            }
        },
        methods: {
            async logout() {
                try {
                    await this.$store.dispatch('auth/logout');
                } catch (e) {
                    //Show Error message
                }
            },
            changeLanguage(lang) {
                this.$store.dispatch('i18n/setLanguage', {language: lang});
            }
        }
    }
</script>

<style lang="scss">
    #elyoos-header {
        position: fixed;
        z-index: 100;
        top: 0;
        height: 56px;
        right: 0;
        left: 0;
        background-color: white;
        border-bottom: 1px solid #ddd;
        #header-container {
            max-width: 950px;
            width: 100%;
            height: 100%;
            margin: 0 auto;
            clear: both;
            #elyoos-logo {
                display: inline-block;
                height: 100%;
                img {
                    margin-top: 13px;
                    @media screen and (max-width: $sm) {
                        margin-left: 12px;
                    }
                    @media screen and (max-width: $xs) {
                        margin-top: 18px;
                        height: 20px;
                        margin-left: 12px;
                    }
                }
            }
            .header-nav {
                float: right;
                height: 100%;
                padding-top: 4px;
                button {
                    color: #666666;
                    border-bottom-color: #666666;
                    i.icon {
                        color: #666666;
                    }
                }
                .active {
                    i.icon {
                        color: $primary-color;
                    }
                }
            }
        }
    }
</style>
