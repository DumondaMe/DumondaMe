<template>
    <div id="public-register" class="explanation-element">
        <div class="public-description-container left-description">
            <h2 class="title-description">Gemeinsam ist alles Möglich!</h2>
            <div class="public-image" v-if="showMobile">
                <img :src="signUp">
            </div>
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
        <div class="public-image" v-if="!showMobile">
            <img :src="signUp">
        </div>
    </div>
</template>

<script>
    export default {
        props: ['showMobile'],
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
            .login-button {
                margin-top: 18px;

                @media screen and (max-width: 900px) {
                    display: block;
                    margin-left: auto;
                    margin-right: auto;
                    margin-top: 12px;
                    width: 100%;
                }
            }
        }
    }
</style>
