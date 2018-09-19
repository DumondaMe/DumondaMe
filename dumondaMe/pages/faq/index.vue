<template>
    <div id="faq-description">
        <h1>{{$t('pages:faq.title')}}</h1>
        <h2>{{$t('pages:faq.question1.title')}}</h2>
        <p>{{$t('pages:faq.question1.text1')}}</p>
        <img :src="getUrl('img/faq/Concept.jpg')">
        <p v-html="$t('pages:faq.question1.text2')"></p>

        <h2>{{$t('pages:faq.question2.title')}}</h2>
        <p>{{$t('pages:faq.question2.text1')}}</p>

        <h2>{{$t('pages:faq.question3.title')}}</h2>
        <p>{{$t('pages:faq.question3.text1')}}</p>
        <p>{{$t('pages:faq.question3.text2')}}</p>

        <h2>{{$t('pages:faq.question4.title')}}</h2>
        <p>{{$t('pages:faq.question4.text1')}}</p>

        <h2>{{$t('pages:faq.question5.title')}}</h2>
        <p>{{$t('pages:faq.question5.text1')}}</p>

        <h2>{{$t('pages:faq.question6.title')}}</h2>
        <p>{{$t('pages:faq.question6.text1')}}</p>

        <h2>{{$t('pages:faq.question7.title')}}</h2>
        <p>{{$t('pages:faq.question7.text1')}}</p>

        <h2>{{$t('pages:faq.question8.title')}}</h2>
        <p>{{$t('pages:faq.question8.text1')}}</p>

        <h2>{{$t('pages:faq.question9.title')}}</h2>
        <p>{{$t('pages:faq.question9.text1')}}</p>

        <h2>{{$t('pages:faq.question10.title')}}</h2>
        <p>{{$t('pages:faq.question10.text1')}}</p>

        <h2>{{$t('pages:faq.question11.title')}}</h2>
        <p v-html="$t('pages:faq.question11.text1')"></p>

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
    #faq-description {
        h1 {
            font-size: 52px;
            line-height: 60px;
            color: #333;
            margin-bottom: 40px;
        }
        h2 {
            font-size: 30px;
            line-height: 46px;
            color: #333;
            margin-top: 30px;
            margin-bottom: 20px;
        }

        img {
            max-width: 450px;
            margin-bottom: 12px;
        }

        p {
            font-weight: 300;
            font-size: 16px;
            line-height: 24px;
        }
    }
</style>