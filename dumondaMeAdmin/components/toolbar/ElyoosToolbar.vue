<template>
    <div id="elyoos-header">
        <div id="header-container">
            <div id="elyoos-logo" hidden-xs-only>
                <img :src="getLogoUrl" @click="$router.push({name: 'index'})"/>
            </div>
            <div class="header-nav" v-if="isAuthenticated">
                <v-menu bottom left>
                    <v-btn icon slot="activator">
                        <v-icon>mdi-dots-vertical</v-icon>
                    </v-btn>
                    <v-list>
                        <v-list-tile @click="logout()">
                            <v-list-tile-title>{{$t("common:toolbar.logout")}}</v-list-tile-title>
                        </v-list-tile>
                    </v-list>
                </v-menu>
            </div>
            <div class="header-nav">
                <v-menu bottom>
                    <v-btn flat icon slot="activator">
                        {{selectedLanguage.description}}
                    </v-btn>
                    <v-list>
                        <v-list-tile @click="changeLanguage(lang.key)" v-for="lang in getLanguages" :key="lang.key">
                            <v-list-tile-title>{{lang.description}}</v-list-tile-title>
                        </v-list-tile>
                    </v-list>
                </v-menu>
            </div>
            <div class="header-nav">
                <v-btn flat icon @click="$router.push({name: 'index'})"
                       :class="{active: $route.path === '/'}">
                    <v-icon>mdi-home-outline</v-icon>
                </v-btn>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {showCreateCommitment: false, showCreateQuestion: false}
        },
        mounted: function () {

        },
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
                    this.$router.push({name: 'index'});
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
            max-width: 1000px;
            width: 100%;
            height: 100%;
            margin: 0 auto;
            clear: both;
            #elyoos-logo {
                display: inline-block;
                cursor: pointer;
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
