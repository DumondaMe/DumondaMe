<template>
    <div class="text-answer-feed-card">
        <div class="feed-card-header">
            <span class="answer-type">Antwort zur Frage </span><span class="card-header-link">
                <nuxt-link :to="{name: 'question-questionId-slug',
                            params: {questionId: answer.questionId, slug: answer.questionSlug},
                            query: {answerId: answer.answerId}}"> {{answer.question}}
                </nuxt-link></span>
            <div class="secondary-text">{{answer.created | formatRelativeTimesAgo}}</div>
        </div>
        <expand-text :expand-text="answer.answer" class="answer-description" itemprop="text">
        </expand-text>
        <card-footer :creator="answer.creator" :user="answer.user" :created="answer.created" :action="answer.action">
        </card-footer>
    </div>
</template>

<script>
    import CardFooter from './footer/CommonAnswer';
    import ExpandText from '~/components/common/text/Expand.vue'

    export default {
        props: ['answer'],
        components: {CardFooter, ExpandText}
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
