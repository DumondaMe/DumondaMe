<template>
    <detail-layout>
        <div slot="content" id="question-detail">
            <question-header>
            </question-header>
            <answers>
            </answers>
        </div>
        <div slot="sidebar">
            <sidebar>
            </sidebar>
        </div>
    </detail-layout>
</template>

<script>
    import DetailLayout from '~/components/layouts/Detail.vue';
    import QuestionHeader from '~/components/question/Header.vue';
    import Answers from '~/components/question/answer/Answers.vue';
    import Sidebar from '~/components/question/sidebar/Sidebar.vue';

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
                meta: [
                    {hid: 'description', name: 'description', content: this.question.description}
                ]
            }
        },
        components: {DetailLayout, QuestionHeader, Answers, Sidebar},
        created() {
            this.question.questionId = this.$route.params.questionId;
            this.$store.commit('question/SET_QUESTION', this.question);
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
