<template>
    <v-app>
        <v-navigation-drawer v-model="drawer" temporary fixed>
            <dumonda-me-navigation-drawer @close-drawer="drawer = false"></dumonda-me-navigation-drawer>
        </v-navigation-drawer>
        <dumonda-me-toolbar @open-drawer="drawer = true"></dumonda-me-toolbar>
        <div id="dumonda-me-content">
            <div id="dumonda-me-inner-content">
                <nuxt/>
            </div>
        </div>
        <dumonda-me-footer id="ely-footer"></dumonda-me-footer>
    </v-app>
</template>

<script>
    import DumondaMeToolbar from '~/components/navigation/toolbar/Toolbar';
    import DumondaMeFooter from '~/components/navigation/footer/Footer';
    import DumondaMeNavigationDrawer from '~/components/navigation/drawer/Drawer';

    export default {
        components: {DumondaMeToolbar, DumondaMeFooter, DumondaMeNavigationDrawer},
        data() {
            return {drawer: null}
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
            .application.theme--light {
                background-color: $background-normal;
                @media screen and (max-width: $xs) {
                    background-color: white;
                }
                #dumonda-me-content {
                    min-height: inherit;
                    height: inherit;
                    padding-top: 124px;
                    padding-bottom: 64px;
                    @media screen and (max-width: 700px) {
                        padding-top: 56px;
                        padding-bottom: 18px;
                    }
                    #dumonda-me-inner-content {
                        max-width: 950px;
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
                .v-navigation-drawer {
                    z-index: 101;
                }
            }
        }
    }

    .dialog {
        @media screen and (max-width: 500px) {
            width: 100%;
            min-width: 100%
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
