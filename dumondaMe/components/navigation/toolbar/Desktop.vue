<template>
    <div>
        <div id="header-desktop-container">
            <div id="dumonda-me-logo">
                <img :src="logoUrl" @click="$router.push({name: 'index'})"/>
            </div>
            <v-spacer></v-spacer>
            <div class="header-nav" v-if="isAuthenticated">
                <v-btn flat icon @click="$router.push({name: 'index'})"
                       :class="{active: $route.path === '/'}">
                    <v-icon>mdi-home-outline</v-icon>
                </v-btn>
            </div>
            <div class="header-nav" v-if="!isAuthenticated">
                <v-menu bottom>
                    <v-btn outline slot="activator">
                        {{selectedLanguage.description}}
                    </v-btn>
                    <v-list>
                        <v-list-tile @click="$emit('change-language', lang.key)" v-for="lang in languages"
                                     :key="lang.key">
                            <v-list-tile-title>{{lang.description}}</v-list-tile-title>
                        </v-list-tile>
                    </v-list>
                </v-menu>
            </div>
            <div class="header-nav" v-if="!isAuthenticated">
                <v-btn outline v-on:click="$router.push({name: 'login'})" class="right-outer-element">
                    {{$t("common:toolbar.login")}}
                </v-btn>
            </div>
            <div class="header-nav" v-if="isAuthenticated">
                <v-btn flat icon @click="$router.push({name: 'user'})" :class="{active: $route.path === '/user'}">
                    <v-icon>mdi-account-outline</v-icon>
                </v-btn>
            </div>
            <div class="header-nav" v-if="isAuthenticated">
                <v-btn flat icon @click="$router.push({name: 'user-notifications'})">
                    <v-badge color="secondary" v-model="showNotification" right overlap>
                        <v-icon>mdi-bell-outline</v-icon>
                        <span slot="badge">{{numberOfNotifications}}</span>
                    </v-badge>
                </v-btn>
            </div>
            <div class="header-nav" v-if="isAuthenticated">
                <v-menu bottom left>
                    <v-btn icon slot="activator" class="right-outer-element">
                        <v-icon>mdi-dots-vertical</v-icon>
                    </v-btn>
                    <v-list>
                        <v-list-tile @click="$router.push({name: 'setting'})">
                            <v-list-tile-title>{{$t("pages:toolbar.settings")}}</v-list-tile-title>
                        </v-list-tile>
                        <v-divider></v-divider>
                        <v-list-tile @click="$emit('create-question')">
                            <v-list-tile-title>{{$t("pages:toolbar.askQuestion")}}</v-list-tile-title>
                        </v-list-tile>
                        <v-list-tile @click="$emit('create-commitment')">
                            <v-list-tile-title>{{$t("pages:toolbar.createCommitment")}}</v-list-tile-title>
                        </v-list-tile>
                        <v-divider></v-divider>
                        <v-list-tile @click="$emit('logout')">
                            <v-list-tile-title>{{$t("pages:toolbar.logout")}}</v-list-tile-title>
                        </v-list-tile>
                    </v-list>
                </v-menu>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        props: ['isAuthenticated', 'languages', 'selectedLanguage', 'logoUrl', 'showNotification',
            'numberOfNotifications'],
    }
</script>

<style lang="scss">
    #header-desktop-container {
        max-width: 950px;
        width: 100%;
        height: 100%;
        margin: 0 auto;
        display: flex;
        @media screen and (max-width: 970px) {
            padding: 0 12px
        }
        #dumonda-me-logo {
            cursor: pointer;
            height: 100%;
            img {
                height: 30px;
                margin-top: 14px;
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
            height: 100%;
            padding-top: 4px;
            button {
                color: #666666;
                border-bottom-color: #666666;
                i.v-icon {
                    color: #666666;
                }
            }
            .active {
                i.v-icon {
                    color: $primary-color;
                }
            }
            .right-outer-element {
                margin-right: 0;
            }
        }
    }
</style>
