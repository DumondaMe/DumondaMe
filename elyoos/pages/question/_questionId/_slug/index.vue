<template>
    <detail-layout>
        <div slot="content">
            <question-header></question-header>
        </div>
        <div slot="sidebar">
            Test Sidebar
        </div>
    </detail-layout>
</template>

<script>
    import DetailLayout from '~/components/layouts/Detail.vue';
    import QuestionHeader from '~/components/question/Header.vue';

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
        components: {DetailLayout, QuestionHeader},
        created() {
            this.question.questionId = this.$route.params.questionId;
            this.$store.commit('question/SET_QUESTION', this.question);
        }
    }
</script>