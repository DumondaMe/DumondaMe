<template>
    <div id="next-steps-description">
        <h1>{{$t('pages:nextSteps.title')}}</h1>
        <p>{{$t('pages:nextSteps.description')}}</p>

        <h2>{{$t('pages:nextSteps.performanceAndError.title')}}</h2>
        <p>{{$t('pages:nextSteps.performanceAndError.description')}}</p>

        <h2>{{$t('pages:nextSteps.design.title')}}</h2>
        <p>{{$t('pages:nextSteps.design.description')}}</p>

        <h2>{{$t('pages:nextSteps.engagements.title')}}</h2>
        <p>{{$t('pages:nextSteps.engagements.description')}}</p>

        <h2>{{$t('pages:nextSteps.more.title')}}</h2>
        <p>{{$t('pages:nextSteps.more.description')}}</p>
    </div>
</template>

<script>
    export default {
        methods: {
            getUrl(url) {
                return `${process.env.staticUrl}/${url}`;
            }
        }
    }
</script>

<style lang="scss">
    #next-steps-description {
        @media screen and (max-width: $xs) {
            margin-top: 18px;
            padding: 0 16px;
        }
        h1 {
            font-size: 52px;
            line-height: 60px;
            color: #333;
            margin-bottom: 20px;
            @media screen and (max-width: $xs) {
                font-size: 28px;
                line-height: 34px;
                margin-bottom: 18px;
            }
        }
        h2 {
            font-size: 30px;
            line-height: 46px;
            color: #333;
            margin-top: 30px;
            margin-bottom: 14px;
            @media screen and (max-width: $xs) {
                font-size: 20px;
                line-height: 28px;
            }
        }

        img {
            max-width: 450px;
            margin-bottom: 12px;
            @media screen and (max-width: $xs) {
                width: 100%;
            }
        }

        p {
            font-weight: 300;
            font-size: 16px;
            line-height: 24px;
        }
        ul {
            font-weight: 300;
            font-size: 16px;
            line-height: 24px;
        }
        b {
            font-weight: 500;
        }
    }
</style>