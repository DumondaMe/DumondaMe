<template>
    <register></register>
</template>

<script>
    import Register from '~/components/register/Register.vue';

    export default {
        components: {Register},
        head() {
            return {
                script: [
                    {src: 'https://www.google.com/recaptcha/api.js?render=explicit', body: true}
                ],
            }
        }
    }
</script>