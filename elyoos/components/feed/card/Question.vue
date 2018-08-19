<template>
    <div class="question-feed-card">
        <div class="feed-card-header">
            <span class="answer-type">Frage </span><span class="card-header-link">
            <nuxt-link :to="{name: 'question-questionId-slug',
                        params: {questionId: question.questionId, slug: question.questionSlug}}"> {{question.question}}
            </nuxt-link></span>
            <div class="secondary-text">{{question.created | formatRelativeTimesAgo}}</div>
        </div>
        <expand-text :expand-text="question.descriptionHtml" class="question-description" itemprop="text">
        </expand-text>
        <card-footer :creator="question.creator" :user="question.user" :created="question.created"
                     :number-of-answers="question.numberOfAnswers" :action="question.action">
        </card-footer>
    </div>
</template>

<script>
    import CardFooter from './footer/Question';
    import ExpandText from '~/components/common/text/Expand.vue'

    export default {
        props: ['question'],
        components: {CardFooter, ExpandText}
    }
</script>

<style lang="scss">
    .question-feed-card {
        .question-description {
            margin-top: 12px;
            margin-bottom: 16px;
        }
        .question-header {
            display: block;
            line-height: 16px;
            .question-icon {
                margin-left: -2px;
                margin-right: 8px;
                font-size: 22px;
            }
            .question-title {
                cursor: pointer;
                font-size: 16px;
                vertical-align: middle;
                color: $primary-color;
                .link {
                    text-decoration: none;
                }
                :hover.link {
                    text-decoration: underline;
                }
            }
        }
    }
</style>
