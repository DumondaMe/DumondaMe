<template>
    <div id="dumonda-me-contact-us">
        <h1>{{$t('pages:contact.title')}}</h1>
        <p v-html="$t('pages:contact.post')"></p>
        <a href='mailto:info@dumonda.me' target='_self'>info@dumonda.me</a>
    </div>
</template>

<script>
    export default {
        computed: {

        }
    }
</script>

<style lang="scss">
    #dumonda-me-contact-us {
        @media screen and (max-width: $xs) {
            margin-top: 18px;
            padding: 0 16px;
        }
        h1 {
            font-size: 32px;
            color: #333;
            margin-bottom: 20px;
            @media screen and (max-width: $xs) {
                font-size: 28px;
                line-height: 34px;
                margin-bottom: 18px;
            }
        }
        p {
            font-weight: 300;
            font-size: 16px;
            line-height: 24px;
        }
    }
</style>