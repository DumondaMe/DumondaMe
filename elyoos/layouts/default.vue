<template>
    <v-app>
        <elyoos-toolbar></elyoos-toolbar>
        <div id="elyoos-content">
            <div id="elyoos-inner-content">
                <nuxt/>
            </div>
        </div>
    </v-app>
</template>

<script>
    import ElyoosToolbar from '~/components/toolbar/ElyoosToolbar.vue';

    export default {
        components: {
            ElyoosToolbar
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
    }

    body {
        #__layout {
            .application.theme--light {
                background-color: $background-normal;
                #elyoos-content {
                    padding-top: 124px;
                    padding-bottom: 64px;
                    margin-bottom: 56px;
                    #elyoos-inner-content {
                        max-width: 950px;
                        width: 100%;
                        margin: 0 auto;
                        @media screen and (max-width: 950px) {
                            padding-left: 8px;
                            padding-right: 8px;
                        }
                    }
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
</style>
