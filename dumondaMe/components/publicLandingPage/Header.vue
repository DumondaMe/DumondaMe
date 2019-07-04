<template>
    <div>
        <div class="public-landing-page-header">
            <img class="logo" :src="logo">
            <h2>{{$t('pages:landingPagePublic.slogan')}}</h2>
        </div>
        <div class="register-container">
            <v-btn round dark color="secondary" @click="$router.push({name: 'register'})">
                {{$t('pages:landingPagePublic.createAccountButton')}}
            </v-btn>
            <v-btn round outline color="primary" @click="$router.push({name: 'login'})">
                {{$t('common:button.login')}}
            </v-btn>
        </div>
    </div>
</template>

<script>
    export default {
        computed: {
            logo() {
                return `${process.env.staticUrl}/img/landingPagePublic/logo.png`;
            },
        }
    }
</script>

<style lang="scss">
    .public-landing-page-header {
        background-color: $primary-color;
        height: 240px;

        padding-top: 60px;

        .logo {
            display: block;
            text-align: center;
            margin: 0 auto;

            @media screen and (max-width: 550px) {
                max-width: 100%;
                padding: 0 16px
            }
        }

        h2 {
            text-align: center;
            color: white;
            margin-top: 12px;
        }
    }

    .register-container {
        display: flex;
        align-items: center;
        justify-content: center;

        padding: 8px 0;
        margin-bottom: 120px;

        @media screen and (max-width: 900px) {
            margin-bottom: 40px;
        }

    }
</style>
