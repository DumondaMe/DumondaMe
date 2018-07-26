<template>
    <div class="text-answer-feed-card">
        <div class="feed-card-header">
            <span class="answer-type">Text Antwort auf die Frage </span><span class="card-header-link">
                <a :href="getQuestionLink">{{answer.question}}</a></span>
            <div class="secondary-text">{{answer.created | formatRelativeTimesAgo}}</div>
        </div>
        <expand-text :expand-text="answer.answer" class="answer-description" itemprop="text">
        </expand-text>
        <card-footer :creator="answer.creator.name" :creator-id="answer.creator.userId"
                     :creator-image="answer.creator.userImage" :creator-slug="answer.creator.slug"
                     :created="answer.created" :action="answer.action" :card-type="answer.type">
        </card-footer>
    </div>
</template>

<script>
    import CardFooter from './footer/CommonAnswer';
    import ExpandText from '~/components/common/text/Expand.vue'

    export default {
        props: ['answer'],
        components: {CardFooter, ExpandText},
        computed: {
            isAuthenticated() {
                return this.$store.state.auth.userIsAuthenticated
            },
            getQuestionLink() {
                return `/question/${this.answer.questionId}/${this.answer.questionSlug}?answerId=${this.answer.answerId}`;
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
