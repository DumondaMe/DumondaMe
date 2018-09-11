<template>
    <detail-layout itemscope itemtype="http://schema.org/Question">
        <div slot="sidebar">
            <create-answer></create-answer>
            <general-information></general-information>
        </div>
        <div slot="content" id="question-detail">
            <question-header></question-header>
            <answers></answers>
        </div>
    </detail-layout>
</template>

<script>
    import DetailLayout from '~/components/layouts/DetailQuestion';
    import QuestionHeader from '~/components/question/Header';
    import Answers from '~/components/question/answer/Answers';
    import CreateAnswer from '~/components/question/CreateAnswer';
    import GeneralInformation from '~/components/question/GeneralInformation';

    export default {
        async asyncData({params, query, app, error, store}) {
            try {
                let paramsToSend = {params: {language: store.state.i18n.language}};
                if (query.answerId) {
                    paramsToSend.params.answerId = query.answerId;
                }
                let resp = await app.$axios.$get(`question/detail/${params.questionId}`, paramsToSend);
                return {question: resp};
            } catch (e) {
                error({statusCode: e.statusCode})
            }
        },
        head() {
            return {
                title: this.question.question,
                htmlAttrs: {
                    lang: this.question.language
                },
                meta: [
                    {hid: 'description', name: 'description', content: this.question.description}
                ]
            }
        },
        components: {DetailLayout, QuestionHeader, Answers, CreateAnswer, GeneralInformation},
        created() {
            this.question.questionId = this.$route.params.questionId;
            this.$store.commit('question/SET_QUESTION', this.question);
        },
        mounted() {
            if (this.$route.query.answerId) {
                let e = window.document.getElementById(`card-${this.$route.query.answerId}`);
                if (!!e && e.scrollIntoView) {
                    e.scrollIntoView(true);
                    window.scrollBy(0, -62);
                }
            }
        }
    }
</script>

<style lang="scss">
    #question-detail {
        .elyoos-answer-container {
            margin-top: 24px;
            .elyoos-answer-content {
                padding-top: 12px;
            }
        }
    }
</style>
