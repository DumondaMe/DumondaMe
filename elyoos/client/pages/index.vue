<template>
    <elyoos-header></elyoos-header>
</template>

<script>

    import ElyoosHeader from '~/components/header/ElyoosHeader.vue';

    export default {
        components: {
            ElyoosHeader
        },
        data() {
            return {
                formError: null,
                formUsername: '',
                formPassword: ''
            }
        },
        methods: {
            async login() {
                try {
                    await this.$store.dispatch('login', {
                        username: this.formUsername,
                        password: this.formPassword
                    });
                    this.formUsername = '';
                    this.formPassword = '';
                    this.formError = null;
                } catch (e) {
                    this.formError = e.message;
                }
            },
            async logout() {
                try {
                    await this.$store.dispatch('logout');
                } catch (e) {
                    this.formError = e.message;
                }
            }
        }
    }
</script>

<style lang="scss">
    .container {
        padding: 100px;
    }

    .error {
        color: red;
    }
</style>