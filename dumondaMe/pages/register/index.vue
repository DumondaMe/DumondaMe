<template>
    <register></register>
</template>

<script>
    import Register from '~/components/register/Register.vue';

    export default {
        async fetch({store}) {
            store.commit('toolbar/SHOW_BACK_BUTTON');
        },
        components: {Register},
        head() {
            return {
                script: [{
                    src: `https://www.google.com/recaptcha/api.js?onload=vueRecaptchaApiLoaded&render=explicit&hl=${this.$store.state.i18n.language}`,
                    defer: true
                }],
            }
        }
    }
</script>