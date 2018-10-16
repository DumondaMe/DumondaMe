<template>
    <div class="commitment-answer-feed-card">
        <div class="feed-card-header">
            <div>
                <span class="answer-type">{{$t('common:feedCard.answerType.commitment')}} </span>
                <span class="card-header-link">
                    <nuxt-link :to="{name: 'commitment-commitmentId-slug',
                            params: {commitmentId: answer.commitmentId, slug: answer.commitmentSlug}}">{{answer.title}}
                    </nuxt-link>
                </span>
                <span v-if="answer.questionId && !hideQuestion">
                    <span class="answer-type">{{$t('common:feedCard.answersQuestion')}} </span><span
                        class="card-header-link">
                         <nuxt-link :to="{name: 'question-questionId-slug',
                        params: {questionId: answer.questionId, slug: answer.questionSlug}}"> {{answer.question}}
                         </nuxt-link></span>
                </span>
                <div class="secondary-text" v-if="!hideTime">{{answer.created | formatRelativeTimesAgo}}</div>
            </div>
            <v-spacer></v-spacer>
            <slot name="feedMenu"></slot>
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
        props: ['answer', 'hideQuestion', 'hideTime'],
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
