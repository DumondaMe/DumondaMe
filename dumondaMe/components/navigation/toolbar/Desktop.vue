<template>
    <div>
        <div id="header-desktop-container">
            <div id="dumonda-me-logo">
                <img :src="logoUrl" @click="$router.push({name: 'index'})"/>
            </div>
            <search-toolbar></search-toolbar>
            <v-spacer></v-spacer>
            <div class="header-nav-button" v-if="!isAuthenticated">
                <v-btn v-on:click="$router.push({name: 'login'})" class="right-outer-element"
                       small color="secondary">
                    {{$t("common:toolbar.login")}}
                </v-btn>
            </div>
            <div class="header-nav" v-if="isAuthenticated">
                <v-btn flat icon @click="$router.push({name: 'user'})" :class="{active: $route.path === '/user'}">
                    <v-icon>mdi-account-outline</v-icon>
                </v-btn>
            </div>
            <div class="header-nav" v-if="isAuthenticated">
                <v-btn flat icon @click="$router.push({name: 'notifications'})">
                    <v-badge color="secondary" v-model="showNotification" right overlap>
                        <v-icon>mdi-bell-outline</v-icon>
                        <span slot="badge">{{numberOfNotifications}}</span>
                    </v-badge>
                </v-btn>
            </div>
            <div class="header-nav menu-nav">
                <v-btn flat icon @click="$emit('open-drawer')">
                    <v-icon>mdi-menu</v-icon>
                </v-btn>
            </div>
        </div>
    </div>
</template>

<script>
    import SearchToolbar from './Search';

    export default {
        props: ['isAuthenticated', 'logoUrl', 'showNotification', 'numberOfNotifications'],
        components: {SearchToolbar}
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
                height: 22px;
                margin-top: 16px;
            }
        }
        .header-nav {
            height: 100%;
            padding-top: 4px;
            button {
                color: #666666;
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
                margin-top: 10px;
                margin-right: 12px;
            }
        }
        .header-nav-button {
            height: 100%;
            padding-top: 8px;
        }
        .header-nav.menu-nav {
            button {
                margin-right: 0;
            }
        }
    }
</style>
