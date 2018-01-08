<template>
    <div id="elyoos-header">
        <div id="header-container">
            <div id="elyoos-logo" hidden-xs-only>
                <img src="img/logo.png"/>
            </div>
            <div class="header-nav" v-if="isAuthenticated">
                <v-menu bottom left>
                    <v-btn icon slot="activator">
                        <v-icon>more_vert</v-icon>
                    </v-btn>
                    <v-list>
                        <v-list-tile @click="">
                            <v-list-tile-title>Dein Profil</v-list-tile-title>
                        </v-list-tile>
                        <v-divider></v-divider>
                        <v-list-tile @click="">
                            <v-list-tile-title>Frage erstellen</v-list-tile-title>
                        </v-list-tile>
                        <v-list-tile @click="">
                            <v-list-tile-title>Organisation erstellen</v-list-tile-title>
                        </v-list-tile>
                        <v-divider></v-divider>
                        <v-list-tile @click="">
                            <v-list-tile-title>Über Elyoos</v-list-tile-title>
                        </v-list-tile>
                        <v-list-tile @click="logout()">
                            <v-list-tile-title>Logout</v-list-tile-title>
                        </v-list-tile>
                    </v-list>
                </v-menu>
            </div>
            <div class="header-nav" v-else>
                <v-btn flat v-on:click="$router.push({name: 'login'})">Anmelden</v-btn>
            </div>
            <div class="header-nav" v-if="isAuthenticated">
                <v-btn flat icon>
                    <v-icon>notifications_none</v-icon>
                </v-btn>
            </div>
            <div class="header-nav">
                <v-btn flat icon v-on:click="$router.push({name: 'index'})">
                    <v-icon>home</v-icon>
                </v-btn>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        computed: {
            isAuthenticated () { return this.$store.state.auth.userIsAuthenticated }
        },
        methods: {
            async logout() {
                try {
                    await this.$store.dispatch('auth/logout');
                } catch (e) {
                    //Show Error message
                }
            }
        }
    }
</script>

<style lang="scss">
    #elyoos-header {
        position: fixed;
        z-index: 1000;
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
                }
            }
            .header-nav {
                float: right;
                height: 100%;
                padding-top: 4px;
                button {
                    i.icon {
                        color: #666666;
                    }
                }
            }
        }
    }
</style>
