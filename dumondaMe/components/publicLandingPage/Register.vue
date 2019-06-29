<template>
    <div id="public-register" class="explanation-element">
        <div class="public-image">
            <img :src="signUp">
        </div>
        <div class="public-description-container">
            <h2 class="title-description">Gemeinsam ist alles Möglich!</h2>
            <div class="description">
                Erstelle ganz unkompliziert einen Account und gestalte gemeinsam mit uns eine leuchtende Zukunft!
            </div>
            <v-btn color="secondary" class="action-button" @click="$router.push({name: 'register'})">
                Account erstellen
            </v-btn>
            <v-btn outline color="primary" class="login-button" @click="$router.push({name: 'login'})">
                Ich habe bereits ein Konto
            </v-btn>
        </div>
    </div>
</template>

<script>
    export default {
        computed: {
            signUp() {
                return `${process.env.staticUrl}/img/landingPagePublic/signUp.jpg`;
            },
        }
    }
</script>

<style lang="scss">
    #public-register {
        margin-top: 80px;
        margin-bottom: 124px;


        .public-description-container {
            margin-left: 32px;
            .login-button {
                margin-top: 18px;
            }
        }
    }
</style>
