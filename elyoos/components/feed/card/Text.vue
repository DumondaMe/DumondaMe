<template>
    <div class="text-answer-feed-card">
        <question-to-answer :question-id="answer.questionId" :question-slug="answer.questionSlug"
                            :question="answer.question">
        </question-to-answer>
        <expand-text :expand-text="answer.answer" class="answer-description" itemprop="text">
        </expand-text>
        <card-footer :creator="answer.creator.name" :creator-id="answer.creator.userId"
                     :creator-slug="answer.creator.slug" :created="answer.created" :action="answer.action"
                     :card-type="answer.type">
        </card-footer>
    </div>
</template>

<script>
    import CardFooter from './footer/CommonAnswer';
    import QuestionToAnswer from './QuestionToAnswer';
    import ExpandText from '~/components/common/text/Expand.vue'

    export default {
        props: ['answer'],
        components: {CardFooter, QuestionToAnswer, ExpandText},
        computed: {
            isAuthenticated() {
                return this.$store.state.auth.userIsAuthenticated
            }
        },
    }
</script>

<style lang="scss">
    .text-answer-feed-card {
        .answer-description {
            margin-bottom: 16px;
        }
        .question-to-answer-container {
            margin-bottom: 8px;
        }
    }
</style>
