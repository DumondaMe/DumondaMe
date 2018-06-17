<template>
    <detail-layout itemscope itemtype="http://schema.org/Question">
        <div slot="content" id="question-detail">
            <question-header>
            </question-header>
            <answers>
            </answers>
        </div>
        <div slot="sidebar">
            <general-information>
            </general-information>
        </div>
    </detail-layout>
</template>

<script>
    import DetailLayout from '~/components/layouts/Detail';
    import QuestionHeader from '~/components/question/Header';
    import Answers from '~/components/question/answer/Answers';
    import GeneralInformation from '~/components/question/GeneralInformation';

    export default {
        async asyncData({params, app, error}) {
            try {
                let resp = await app.$axios.$get(`question/detail/${params.questionId}`);
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
        components: {DetailLayout, QuestionHeader, Answers, GeneralInformation},
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
