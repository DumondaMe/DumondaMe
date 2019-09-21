<template>
    <v-layout row wrap class="login-page">
        <v-flex xs12 md6>
            <login email="" :from-route="fromRoute">
            </login>
        </v-flex>
        <v-flex xs12 md6>
            <register-link>
            </register-link>
        </v-flex>
    </v-layout>
</template>

<script>
    import Login from '~/components/login/Login.vue';
    import RegisterLink from '~/components/login/RegisterLink.vue';

    export default {
        components: {Login, RegisterLink},
        data() {
            return {fromRoute: null}
        },
        beforeRouteEnter(to, fromRoute, next) {
            next(vm => {
                vm.fromRoute = fromRoute;
            })
        }
    }
</script>

<style lang="scss">
    .layout.login-page {
        margin: 0;
    }
</style>