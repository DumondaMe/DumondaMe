<template>
    <v-layout row wrap>
        <password-reset></password-reset>
    </v-layout>
</template>

<script>
    import PasswordReset from '~/components/login/PasswordReset.vue';

    export default {
        components: {PasswordReset}
    }
</script>