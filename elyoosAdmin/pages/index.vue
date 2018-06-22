<template>
    <h1>das ist ein Test</h1>
</template>

<script>

    export default {
        async fetch({query, app, error, store}) {
            console.log('Eigentlich muesste das laden')
            /*try {

            } catch (e) {
                error({statusCode: e.statusCode})
            }*/
        },
        components: {},
        head() {
            return {
                htmlAttrs: {
                    lang: this.$store.state.i18n.language
                },
            }
        },
        data() {
            return {loadNextRunning: false}
        },
        computed: {
            isAuthenticated() {
                return this.$store.state.auth.userIsAuthenticated
            }
        }
    }
</script>

<style lang="scss">

</style>