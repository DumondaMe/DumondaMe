<template>
    <v-layout row wrap>
        <password-reset></password-reset>
    </v-layout>
</template>

<script>
    import PasswordReset from '~/components/login/PasswordReset.vue';

    export default {
        async fetch({store}) {
            store.commit('toolbar/SHOW_BACK_BUTTON');
        },
        components: {PasswordReset}
    }
</script>