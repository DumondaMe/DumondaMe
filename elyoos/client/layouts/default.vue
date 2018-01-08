<template>
    <v-app>
        <elyoos-toolbar app></elyoos-toolbar>
        <v-content id="elyoos-content">
            <v-container>
                <nuxt/>
            </v-container>
        </v-content>
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
        overflow-y: hidden;
        height: 100%;
    }
    body {
        height: 100%;
        #__nuxt {
            height: 100%;
            #app {
                height: 100%;
                #elyoos-content {
                    height: 100%;
                    padding-top: 120px;
                    overflow-y: auto;
                    max-width: 950px;
                    width: 100%;
                    margin: 0 auto;
                    @media screen and (max-width: 950px) {
                        padding-left: 8px;
                        padding-right: 8px;
                    }
                    .container {
                        padding: 0;
                        margin: 0;
                    }
                }
            }
        }
    }

    *, *:before, *:after {
        box-sizing: border-box;
        margin: 0;
        text-transform: none !important;
    }
</style>
