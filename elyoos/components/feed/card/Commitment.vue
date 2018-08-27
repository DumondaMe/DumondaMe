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
                    <span v-if="!hideQuestion">
                    <span class="answer-type">beantwortet die Frage </span><span class="card-header-link">
                         <nuxt-link :to="{name: 'question-questionId-slug',
                        params: {questionId: answer.questionId, slug: answer.questionSlug}}"> {{answer.question}}
                         </nuxt-link></span></span>
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
        <slot name="footer"></slot>
    </div>
</template>

<script>
    import ExpandText from '~/components/common/text/Expand.vue'

    export default {
        props: ['answer', 'hideQuestion'],
        components: {ExpandText},
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
