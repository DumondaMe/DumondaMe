<template>
    <div>
        <div id="dumonda-me-mobile-header">
            <div class="dumonda-me-mobile-header-container" v-if="showSearch || $route.name === 'search'">
                <search-toolbar @close-search="closeSearch"></search-toolbar>
            </div>
            <div class="dumonda-me-mobile-header-container" v-else>
                <v-btn icon class="nav-icon" v-if="$route.name === 'index' || $route.name === 'commitment' ||
            $route.name === 'event' || $route.name === 'activity'" @click="$emit('open-drawer')">
                    <v-icon>mdi-menu</v-icon>
                </v-btn>
                <v-btn icon class="nav-icon" v-else @click="$router.go(-1)">
                    <v-icon>mdi-arrow-left</v-icon>
                </v-btn>
                <div class="mobile-header-title" v-if="$route.name === 'index'">{{$t('common:toolbar.questions')}}</div>
                <div class="mobile-header-title" v-else-if="$route.name === 'commitment'">
                    {{$t('common:toolbar.commitments')}}
                </div>
                <div class="mobile-header-title" v-else-if="$route.name === 'event'">{{$t('common:toolbar.events')}}
                </div>
                <div class="mobile-header-title" v-else-if="$route.name === 'activity'">
                    {{$t('common:toolbar.activities')}}
                </div>
                <v-spacer></v-spacer>
                <v-btn icon class="nav-icon">
                    <v-icon @click="showSearch = true">mdi-magnify</v-icon>
                </v-btn>
                <v-btn icon class="nav-icon" @click="$router.push({name: 'user-notifications'})" v-if="isAuthenticated">
                    <v-badge color="secondary" v-model="showNotification" right overlap>
                        <v-icon>mdi-bell-outline</v-icon>
                        <span slot="badge">{{numberOfNotifications}}</span>
                    </v-badge>
                </v-btn>
                <v-btn icon class="nav-icon" v-if="!isAuthenticated" @click="$router.push({name: 'login'})">
                    <v-icon>mdi-login-variant</v-icon>
                </v-btn>
                <div class="nav-icon" v-if="isAuthenticated">
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
    </div>
</template>

<script>
    import SearchToolbar from './Search';

    export default {
        props: ['isAuthenticated', 'languages', 'selectedLanguage', 'logoUrl', 'showNotification',
            'numberOfNotifications'],
        components: {SearchToolbar},
        data() {
            return {showSearch: false}
        },
        methods: {
            closeSearch() {
                if (this.$route.name === 'search') {
                    this.$router.push({name: 'index'});
                }
                this.showSearch = false
            }
        }
    }
</script>

<style lang="scss">
    #dumonda-me-mobile-header {
        background-color: $background-normal;
        padding: 4px 0;
        .dumonda-me-mobile-header-container {
            display: flex;
        }
        .mobile-header-title {
            margin-left: 8px;
            height: 48px;
            line-height: 48px;
            font-weight: 500;
        }
    }
</style>
