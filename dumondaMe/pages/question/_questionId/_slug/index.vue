<template>
    <detail-layout itemscope itemtype="http://schema.org/Question">
        <div slot="sidebar">
            <create-answer></create-answer>
            <beta-version></beta-version>
            <general-information></general-information>
        </div>
        <div slot="content" id="question-detail">
            <question-header></question-header>
            <general-information id="general-information-mobile"></general-information>
            <answers></answers>
        </div>
    </detail-layout>
</template>

<script>
    import DetailLayout from '~/components/layouts/Detail';
    import QuestionHeader from '~/components/question/Header';
    import Answers from '~/components/question/answer/Answers';
    import CreateAnswer from '~/components/question/CreateAnswer';
    import GeneralInformation from '~/components/question/GeneralInformation';
    import BetaVersion from "~/components/common/beta/BetaDescription";

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
        components: {DetailLayout, QuestionHeader, Answers, CreateAnswer, GeneralInformation, BetaVersion},
        created() {
            this.question.questionId = this.$route.params.questionId;
            this.$store.commit('question/SET_QUESTION', this.question);
        }
    }
</script>

<style lang="scss">
    #question-detail {
        .dumonda-me-answer-container {
            margin-top: 24px;
            @media screen and (max-width: $xs) {
                margin-top: 0;
            }
            .dumonda-me-answer-content {
                padding-top: 12px;
                @media screen and (max-width: $xs) {
                    padding-top: 0;
                }
            }
        }
        #general-information-mobile {
            @media screen and (min-width: $xs) {
                display: none;
            }
            @media screen and (max-width: $xs) {
                border-bottom: none;
            }
        }
    }
</style>
