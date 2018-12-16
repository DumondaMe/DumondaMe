<template>
    <div class="question-register-info ely-card">
        <div class="about-title">{{$t('pages:feeds.aboutDumondaMeInfos.register.title')}}</div>
        <div class="about-description">{{$t('pages:feeds.aboutDumondaMeInfos.register.description')}}</div>
        <v-btn color="secondary" @click="$router.push({name: 'register'})">
            {{$t('common:button.register')}}
        </v-btn>
    </div>
</template>

<style lang="scss">
    .question-register-info {
        margin-bottom: 12px;
        .about-title {
            font-weight: 500;
            margin-bottom: 12px;
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
