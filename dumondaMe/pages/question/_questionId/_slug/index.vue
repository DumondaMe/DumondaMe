<template>
    <div itemscope itemtype="http://schema.org/QAPage">
        <detail-layout itemprop="mainEntity" itemscope itemtype="http://schema.org/Question">
            <div slot="sidebar">
                <create-answer></create-answer>
                <beta-version></beta-version>
                <register v-if="!isAuthenticated"></register>
                <general-information></general-information>
                <similar-questions></similar-questions>
            </div>
            <div slot="content" id="question-detail">
                <question-header></question-header>
                <general-information class="sidebar-on-mobile"></general-information>
                <answers></answers>
                <register class="register-on-mobile" v-if="!isAuthenticated"></register>
                <similar-questions class="sidebar-on-mobile"></similar-questions>
            </div>
        </detail-layout>
    </div>
</template>

<script>
    import DetailLayout from '~/components/layouts/Detail';
    import QuestionHeader from '~/components/question/Header';
    import Answers from '~/components/question/answer/Answers';
    import CreateAnswer from '~/components/question/CreateAnswer';
    import GeneralInformation from '~/components/question/GeneralInformation';
    import SimilarQuestions from '~/components/question/SimilarQuestions';
    import Register from '~/components/question/Register';
    import BetaVersion from "~/components/common/beta/BetaDescription";

    export default {
        async fetch({params, query, app, error, store}) {
            try {
                let paramsToSend = {params: {language: store.state.i18n.language}};
                if (query.answerId) {
                    paramsToSend.params.answerId = query.answerId;
                }
                let question = await app.$axios.$get(`question/detail/${params.questionId}`, paramsToSend);
                question.questionId = params.questionId;
                store.commit('question/SET_QUESTION', question);
            } catch (e) {
                error({statusCode: e.statusCode})
            }
        },
        head() {
            let description = '';
            if (this.question && this.question.description) {
                description = this.question.description.substring(0, 150);
                if (this.question.description.length > 150) {
                    description += '...';
                }
            }
            return {
                title: this.question.question,
                htmlAttrs: {
                    lang: this.question.language
                },
                meta: [
                    {hid: 'description', name: 'description', content: description},
                    {hid: 'og:title', name: 'og:title', content: this.question.question},
                    {hid: 'og:description', name: 'og:description', content: description},
                    {hid: 'og:url', name: 'og:url', content: `https://dumonda.me${this.$route.path}`},
                    {hid: 'twitter:title', name: 'twitter:title', content: this.question.question},
                    {hid: 'twitter:description', name: 'twitter:description', content: description}
                ]
            }
        },
        components: {
            Register, DetailLayout, QuestionHeader, Answers, CreateAnswer, GeneralInformation, BetaVersion,
            SimilarQuestions
        },
        computed: {
            question() {
                return this.$store.state.question.question;
            },
            isAuthenticated() {
                return this.$store.state.auth.userIsAuthenticated
            }
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

        .register-on-mobile {
            margin-bottom: 0;
            @media screen and (min-width: $xs) {
                display: none;
            }
        }

        .sidebar-on-mobile {
            @media screen and (min-width: $xs) {
                display: none;
            }
            @media screen and (max-width: $xs) {
                border-bottom: none;
            }
        }
    }
</style>
