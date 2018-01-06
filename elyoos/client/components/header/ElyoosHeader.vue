<template>
    <div id="elyoos-header">
        <div id="header-container">
            <div id="elyoos-logo">
                <img src="img/logo.png"/>
            </div>
            <div class="header-nav">
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
                        <v-list-tile @click="">
                            <v-list-tile-title>Logout</v-list-tile-title>
                        </v-list-tile>
                    </v-list>
                </v-menu>
            </div>
            <div class="header-nav">
                <v-btn flat icon>
                    <v-icon>notifications_none</v-icon>
                </v-btn>
            </div>
            <div class="header-nav">
                <v-btn flat icon>
                    <v-icon>home</v-icon>
                </v-btn>
            </div>
        </div>
    </div>
</template>

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
            width: 950px;
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
            }
        }
    }
</style>
