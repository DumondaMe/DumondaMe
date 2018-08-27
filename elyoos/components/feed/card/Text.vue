<template>
    <div class="text-answer-feed-card">
        <div class="feed-card-header">
            <span class="answer-type" v-if="!hideQuestion">Antwort zur Frage </span><span class="answer-type" v-else>Antwort</span>
            <span class="card-header-link">
                <nuxt-link :to="{name: 'question-questionId-slug',
                            params: {questionId: answer.questionId, slug: answer.questionSlug},
                            query: {answerId: answer.answerId}}"> {{answer.question}}
                </nuxt-link></span>
            <div class="secondary-text">{{answer.created | formatRelativeTimesAgo}}</div>
        </div>
        <expand-text :expand-text="answer.answer" class="answer-description" itemprop="text">
        </expand-text>
        <slot name="footer"></slot>
    </div>
</template>

<script>
    import ExpandText from '~/components/common/text/Expand.vue'

    export default {
        props: ['answer', 'hideQuestion'],
        components: {ExpandText}
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
