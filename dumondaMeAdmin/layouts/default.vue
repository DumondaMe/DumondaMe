<template>
    <v-app>
        <dumonda-me-toolbar></dumonda-me-toolbar>
        <div id="dumonda-me-content">
            <div id="dumonda-me-inner-content">
                <nuxt/>
            </div>
        </div>
    </v-app>
</template>

<script>
    import DumondaMeToolbar from '~/components/toolbar/Toolbar';

    export default {
        components: {DumondaMeToolbar}
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
    }

    body {
        #__layout {
            .application.theme--light {
                background-color: $background-normal;
                #dumonda-me-content {
                    min-height: inherit;
                    height: inherit;
                    padding-top: 124px;
                    padding-bottom: 64px;
                    #dumonda-me-inner-content {
                        max-width: 1000px;
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
