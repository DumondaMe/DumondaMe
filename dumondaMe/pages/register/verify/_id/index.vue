<template>
    <v-layout row wrap>
        <v-flex xs12 md6>
            <login :email="email"></login>
        </v-flex>
        <v-flex xs12 md6>
            <div id="successfully-registered-message">
                Du hast dein Konto erfolgreich aktiviert. Melde dich nun mit deiner E-Mail Adresse und deinem Passwort
                an.
            </div>
        </v-flex>
    </v-layout>
</template>

<script>
    import Login from '~/components/login/Login.vue';
    import RegisterLink from '~/components/login/RegisterLink.vue';

    export default {
        components: {Login, RegisterLink},
        async asyncData({params, app , error}) {
            try {
                let resp = await app.$axios.$post('register/verify', {linkId: params.id});
                return {email: resp.email};
            } catch (e) {
                error({
                    statusCode: 400,
                    message: 'Dein Konto zu aktivieren ist fehlgeschlagen. Kontaktiere doch bitte info@dumonda.me.'
                })
            }
        }
    }
</script>

<style lang="scss">
    #successfully-registered-message {
        max-width: 300px;
        margin: 12px auto 0 auto;
        color: $success-text;

        @media screen and (min-width: $sm) {
            background-color: white;
            border-radius: 6px;
            border: 1px solid #e0e0e0;
            padding: 12px;
            margin: 0;
        }
    }
</style>