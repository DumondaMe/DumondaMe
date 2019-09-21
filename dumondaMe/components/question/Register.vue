<template>
    <div class="question-register-info ely-card">
        <div class="about-title">{{$t('pages:feeds.aboutDumondaMeInfos.register.title')}}</div>
        <img :src="signUpImage" :srcset="signUp2xImage" class="sign-up-image">
        <div class="about-description">{{$t('pages:feeds.aboutDumondaMeInfos.register.description')}}</div>
        <v-btn color="secondary" @click="$router.push({name: 'register'})">
            {{$t('common:button.register')}}
        </v-btn>
    </div>
</template>

<script>
    export default {
        computed: {
            signUpImage() {
                return `${process.env.staticUrl}/img/question/signUp.jpg`;
            },
            signUp2xImage() {
                return `${process.env.staticUrl}/img/question/signUp_2x.jpg 2x`;
            }
        }
    }
</script>

<style lang="scss">
    .question-register-info {
        margin-bottom: 12px;

        @media screen and (max-width: $xs) {
            max-width: 518px;
        }

        .about-title {
            font-weight: 500;
            margin-bottom: 12px;
        }

        .sign-up-image {
            width: 100%;
            border-radius: 4px;
            margin-bottom: 8px;
        }

        .about-description {
            font-weight: 300;
            font-size: 14px;
            @media screen and (max-width: $xs) {
                font-size: 16px;
            }
        }

        button {
            margin: 12px 18px 0 0;
            @media screen and (max-width: $xs) {
                margin-bottom: 12px;
            }
        }

    }
</style>
