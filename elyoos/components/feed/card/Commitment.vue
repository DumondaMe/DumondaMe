<template>
    <div class="commitment-answer-feed-card">
        <div class="feed-card-header">
            <span class="answer-type">Engagement </span>
                <span v-if="answer.questionId">
                    <span class="card-header-link">
                        <nuxt-link :to="{name: 'question-questionId-slug',
                                params: {questionId: answer.questionId, slug: answer.questionSlug},
                                query: {answerId: answer.answerId}}">{{answer.title}}
                        </nuxt-link>
                    </span>
                    <span class="answer-type">beantwortet die Frage </span><span class="card-header-link">
                         <nuxt-link :to="{name: 'question-questionId-slug',
                        params: {questionId: answer.questionId, slug: answer.questionSlug}}"> {{answer.question}}
                         </nuxt-link></span>
                </span>
                <span class="card-header-link" v-else>
                    <nuxt-link :to="{name: 'commitment-commitmentId-slug',
                            params: {commitmentId: answer.commitmentId, slug: answer.commitmentSlug}}">{{answer.title}}
                    </nuxt-link>
                </span>
            <div class="secondary-text">{{answer.created | formatRelativeTimesAgo}}</div>
        </div>
        <div class="commitment-answer-content">
            <div class="commitment-preview-image">
                <img :src="answer.imageUrl">
            </div>
            <div class="answer-description">
                <expand-text :expand-text="answer.description"
                             :class="{'no-commitment-image': !answer.imageUrl}" itemprop="text">
                </expand-text>
            </div>
        </div>
        <card-footer :user="answer.user" :creator="answer.creator"
                     :created="answer.created" :action="answer.action"
                     :regions="answer.regions" :card-type="answer.type">
        </card-footer>
    </div>
</template>

<script>
    import CardFooter from './footer/Commitment';
    import ExpandText from '~/components/common/text/Expand.vue'

    export default {
        props: ['answer'],
        components: {CardFooter, ExpandText},
        data() {
            return {expandDescription: false}
        }
    }
</script>

<style lang="scss">
    .commitment-answer-feed-card {
        .commitment-answer-content {
            min-height: 90px;
            margin-bottom: 16px;
            .commitment-preview-image {
                img {
                    margin-top: 3px;
                    width: 100%;
                    border-radius: 4px;
                }
            }
            .answer-description {
                word-wrap: break-word;
            }
            .answer-description.no-commitment-image {
                margin-left: 0;
            }
        }
    }
</style>
