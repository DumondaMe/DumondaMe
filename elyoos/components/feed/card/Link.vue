<template>
    <div class="link-answer-feed-card">
        <div class="feed-card-header">
            <span class="answer-type">{{answerType}} </span><span class="card-header-link">
                <nuxt-link :to="{name: 'question-questionId-slug',
                            params: {questionId: answer.questionId, slug: answer.questionSlug},
                            query: {answerId: answer.answerId}}"> {{answer.title}}
                </nuxt-link></span> <span class="answer-type">beantwortet die Frage </span><span class="card-header-link">
                <nuxt-link :to="{name: 'question-questionId-slug',
                        params: {questionId: answer.questionId, slug: answer.questionSlug}}"> {{answer.question}}
                </nuxt-link></span>
            <div class="secondary-text">{{answer.created | formatRelativeTimesAgo}}</div>
        </div>
        <div class="link-answer-content">
            <div class="link-preview-image" v-if="answer.imageUrl">
                <img :src="answer.imageUrl">
            </div>
            <div class="answer-description" :class="{'no-link-image': !answer.imageUrl}">
                <expand-text :expand-text="answer.description"
                             :class="{'no-link-image': !answer.imageUrl}" itemprop="text">
                </expand-text>
            </div>
        </div>
        <card-footer :creator="answer.creator" :user="answer.user" :action="answer.action" :card-type="answer.type">
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
            answerType() {
                if (this.answer.pageType) {
                    return this.$t(`pages:detailQuestion.answerType.link.${this.answer.pageType}`)
                }
                return this.$t(`pages:detailQuestion.answerType.link.link`)
            }
        }
    }
</script>

<style lang="scss">
    .link-answer-feed-card {
        .link-answer-content {
            .link-preview-image {
                img {
                    border-radius: 4px;
                    width: 100%;
                }
            }
            .answer-description {
                margin-bottom: 16px;
            }
        }
        .link-answer-content.no-link-image {
            min-height: 0;
        }
    }
</style>
