<template>
    <div id="ely-vision">
        <h1>{{$t('pages:vision.title')}}</h1>
        <p>{{$t('pages:vision.text1')}}</p>
        <p>{{$t('pages:vision.text2')}}</p>
        <v-btn color="primary" @click="$router.push({name: 'aboutUs'})">{{$t('pages:vision.aboutUsButton')}}</v-btn>
    </div>
</template>

<script>
    export default {
        computed: {
            selectedLanguage() {
                return this.$store.state.i18n.language
            }
        }
    }
</script>

<style lang="scss">
    #ely-vision {
        padding-top: 18px;
        max-width: 600px;
        margin: 0 auto;
        @media screen and (max-width: $xs) {
            margin-top: 18px;
            padding: 0 16px;
        }
        h1 {
            font-size: 42px;
            line-height: 50px;
            margin-bottom: 18px;

            @media screen and (max-width: $xs) {
                font-size: 28px;
            }
        }
        p {
            font-weight: 300;
            font-size: 16px;
            line-height: 24px;
        }

        button {
            margin-left: 0;
        }
    }
</style>