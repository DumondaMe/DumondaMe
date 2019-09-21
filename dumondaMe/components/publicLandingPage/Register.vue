<template>
    <div id="public-register" class="explanation-element">
        <div class="public-description-container left-description">
            <h2 class="title-description">{{$t('pages:landingPagePublic.register.title')}}</h2>
            <div class="public-image" v-if="showMobile">
                <img v-lazy="signUp">
            </div>
            <div class="description">
                {{$t('pages:landingPagePublic.register.description')}}
            </div>
            <v-btn color="secondary" class="action-button" @click="$router.push({name: 'register'})">
                {{$t('pages:landingPagePublic.createAccountButton')}}
            </v-btn>
            <v-btn outlined color="primary" class="login-button" @click="$router.push({name: 'login'})">
                {{$t('pages:landingPagePublic.register.loginButton')}}
            </v-btn>
        </div>
        <div class="public-image" v-if="!showMobile">
            <img v-lazy="signUp">
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

            .action-button {
                margin-top: 18px;
                margin-right: 12px;
            }

            .login-button {
                margin-top: 18px;

                @media screen and (max-width: 900px) {
                    display: block;
                    margin-top: 12px;
                    width: 100%;
                }
            }
        }
    }
</style>
