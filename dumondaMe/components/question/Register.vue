<template>
    <div class="question-register-info ely-card">
        <div class="about-title">{{$t('pages:feeds.aboutDumondaMeInfos.register.title')}}</div>
        <img :src="signUpImage" :srcset="signUp2xImage" class="sign-up-image">
        <div class="about-description">{{$t('pages:feeds.aboutDumondaMeInfos.register.description')}}</div>
        <div class="register-command">
            <v-btn color="secondary" @click="$router.push({name: 'register'})">
                {{$t('common:button.register')}}
            </v-btn>
        </div>
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
            @include defaultPaddingCard();
        }

        .sign-up-image {
            width: 100%;
            border-radius: 4px;
            margin-bottom: 8px;
        }

        .about-description {
            @include defaultPaddingCard();
            font-weight: 300;
            font-size: 16px;
        }

        .register-command {
            @include defaultPaddingCard();

            button {
                width: 100%;
                margin: 12px 18px 0 0;
                @media screen and (max-width: $xs) {
                    margin-bottom: 12px;
                }
            }
        }

    }
</style>
