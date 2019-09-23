<template>
    <div>
        <password-reset-request></password-reset-request>
    </div>
</template>

<script>
    import PasswordResetRequest from '~/components/login/PasswordResetRequest.vue';

    export default {
        async fetch({store}) {
            store.commit('toolbar/SHOW_BACK_BUTTON');
        },
        components: {PasswordResetRequest}
    }
</script>