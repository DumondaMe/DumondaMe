<template>
    <div itemscope itemtype="http://schema.org/QAPage">
        <detail-layout itemprop="mainEntity" itemscope itemtype="http://schema.org/Question" class="question-layout">
            <div slot="sidebar">
                <harvesting-information v-if="hasHarvestingInfos"></harvesting-information>
                <register v-if="!isAuthenticated"></register>
                <ask-user-answer-question v-if="isAuthenticated"></ask-user-answer-question>
                <general-information></general-information>
                <similar-questions></similar-questions>
            </div>
            <div slot="content" id="question-detail">
                <question-header></question-header>
                <general-information class="sidebar-on-mobile"></general-information>
                <harvesting-information class="sidebar-on-mobile" v-if="hasHarvestingInfos"></harvesting-information>
                <ask-user-answer-question class="sidebar-on-mobile" v-if="isAuthenticated"></ask-user-answer-question>
                <answers></answers>
                <register class="register-on-mobile" v-if="!isAuthenticated"></register>
                <similar-questions class="sidebar-on-mobile"></similar-questions>

                <fab-button :fab-icon="'mdi-forum'" :button-label="$t('common:button.answer')"
                            :show-button-breakpoint="850"
                            @show-create-dialog="showCreateAnswerDialog = true"></fab-button>

                <v-layout row justify-center v-if="showCreateAnswerDialog">
                    <v-dialog v-model="showCreateAnswerDialog" scrollable persistent max-width="770px"
                              :fullscreen="$vuetify.breakpoint.xsOnly">
                        <create-answer-dialog @close-dialog="showCreateAnswerDialog = false">
                        </create-answer-dialog>
                    </v-dialog>
                </v-layout>
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
    import HarvestingInformation from '~/components/question/HarvestingInformation';
    import AskUserAnswerQuestion from '~/components/question/AskUserAnswerQuestion';
    import SimilarQuestions from '~/components/question/SimilarQuestions';
    import Register from '~/components/question/Register';
    import FabButton from '~/components/common/fabButton/Button';
    import CreateAnswerDialog from '~/components/question/answer/dialog/CreateDialog.vue';

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
                if (e && e.request && e.request.res && e.request.res.statusCode) {
                    error({statusCode: e.request.res.statusCode});
                } else if (e.message === 'Network Error') {
                    error({statusCode: 600});
                }
            }
            store.commit('toolbar/SHOW_BACK_BUTTON');
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
            Register, DetailLayout, QuestionHeader, Answers, CreateAnswer, GeneralInformation, HarvestingInformation,
            SimilarQuestions, AskUserAnswerQuestion, FabButton, CreateAnswerDialog
        },
        data() {
            return {showCreateAnswerDialog: false}
        },
        computed: {
            question() {
                return this.$store.state.question.question;
            },
            hasHarvestingInfos() {
                return this.$store.state.question.question.harvestingUser;
            },
            isAuthenticated() {
                return this.$store.state.auth.userIsAuthenticated
            }
        }
    }
</script>

<style lang="scss">
    .question-layout {
        padding-top: 18px;

        #question-detail {
            @media screen and (max-width: $xs) {
                margin: 0 auto;
                max-width: 518px;
            }

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
            }
        }
    }
</style>
