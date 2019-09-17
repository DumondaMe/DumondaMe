<template>
    <div>
        <div id="dumonda-me-mobile-header">
            <div class="dumonda-me-mobile-header-container" v-if="showSearch || $route.name === 'search'">
                <search-toolbar @close-search="closeSearch"></search-toolbar>
            </div>
            <div class="dumonda-me-mobile-header-container" v-else>
                <v-btn icon class="nav-icon" v-if="$route.name === 'index' || $route.name === 'commitment' ||
            $route.name === 'event' || $route.name === 'activity' || $route.name === 'question'"
                       @click="$emit('open-drawer')">
                    <v-icon>mdi-menu</v-icon>
                </v-btn>
                <v-btn icon class="nav-icon" v-else @click="navigateBack">
                    <v-icon>mdi-arrow-left</v-icon>
                </v-btn>
                <div class="mobile-header-title" v-if="$route.name === 'index' && isAuthenticated">
                    {{$t('common:toolbar.activities')}}
                </div>
                <div class="mobile-header-title" v-else-if="$route.name === 'index' && !isAuthenticated">
                    {{$t('common:toolbar.questions')}}
                </div>
                <div class="mobile-header-title" v-else-if="$route.name === 'commitment'">
                    {{$t('common:toolbar.commitments')}}
                </div>
                <div class="mobile-header-title" v-else-if="$route.name === 'event'">{{$t('common:toolbar.events')}}
                </div>
                <div class="mobile-header-title" v-else-if="$route.name === 'question'">
                    {{$t('common:toolbar.questions')}}
                </div>
                <v-spacer></v-spacer>
                <v-btn icon class="nav-icon">
                    <v-icon @click="showSearch = true">mdi-magnify</v-icon>
                </v-btn>
                <v-btn icon class="nav-icon nav-bell" @click="$router.push({name: 'notifications'})"
                       v-if="isAuthenticated">
                    <v-badge color="secondary" v-model="showNotification" right overlap>
                        <v-icon>mdi-bell-outline</v-icon>
                        <span slot="badge">{{numberOfNotifications}}</span>
                    </v-badge>
                </v-btn>
                <v-btn icon class="nav-icon" v-if="!isAuthenticated" @click="$router.push({name: 'login'})">
                    <v-icon>mdi-login-variant</v-icon>
                </v-btn>
            </div>
        </div>
    </div>
</template>

<script>
    import SearchToolbar from './Search';

    export default {
        props: ['isAuthenticated', 'showNotification', 'numberOfNotifications'],
        components: {SearchToolbar},
        data() {
            return {showSearch: false}
        },
        methods: {
            navigateBack() {
                if (document.referrer.includes(process.env.domainUrl)) {
                    this.$router.go(-1);
                } else {
                    this.$router.push({name: 'index'});
                }
            },
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
        height: 56px;

        .dumonda-me-mobile-header-container {
            display: flex;

            .nav-icon {
                padding-top: 12px;
                margin-left: 12px;
                maring-right: 12px;
            }
        }

        .mobile-header-title {
            margin-left: 8px;
            height: 48px;
            line-height: 48px;
            font-weight: 500;
        }

        .nav-icon.nav-bell {
            margin-right: 18px;
        }
    }
</style>
