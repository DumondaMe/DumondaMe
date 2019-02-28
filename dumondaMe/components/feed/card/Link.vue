<template>
    <div class="link-answer-feed-card">
        <div class="feed-card-header">
            <div>
                <h2 class="feed-card-title">
                    <div v-if="!hideQuestion">
                        <span class="answer-type">{{answerType}} </span><span class="card-header-link">
                        <nuxt-link :to="{name: 'question-questionId-slug',
                            params: {questionId: answer.questionId, slug: answer.questionSlug},
                            query: {answerId: answer.answerId}}"> {{answer.title}}
                        </nuxt-link></span>
                        <span class="answer-type">{{$t('common:feedCard.answersQuestion')}} </span><span
                            class="card-header-link">
                        <nuxt-link :to="{name: 'question-questionId-slug',
                        params: {questionId: answer.questionId, slug: answer.questionSlug}}"> {{answer.question}}
                        </nuxt-link></span>
                    </div>
                    <div v-else>
                        <span class="answer-type">{{answerType}} </span>
                        <span class="card-header-link"><a target="_blank" rel="noopener" :href="answer.link"
                                                          class="link">{{answer.title}} </a>
                        </span>
                    </div>
                </h2>
                <time class="secondary-text" itemprop="dateCreated" :datetime="dateCreatedIso">
                    {{answer.created | formatRelativeTimesAgo}}
                </time>
            </div>
            <v-spacer></v-spacer>
            <slot name="feedMenu"></slot>
        </div>
        <div class="link-answer-content">
            <div class="link-preview-image" v-if="answer.imageUrl">
                <img v-lazy="answer.imageUrl" @click="openLink">
            </div>
            <div class="answer-description" :class="{'no-link-image': !answer.imageUrl}">
                <expand-text :expand-text="answer.description"
                             :class="{'no-link-image': !answer.imageUrl}">
                </expand-text>
            </div>
        </div>
        <slot name="footer"></slot>
    </div>
</template>

<script>
    import ExpandText from '~/components/common/text/Expand.vue'
    import format from 'date-fns/format'

    export default {
        props: ['answer', 'hideQuestion'],
        components: {ExpandText},
        computed: {
            answerType() {
                if (this.answer.pageType) {
                    return this.$t(`common:feedCard.answerType.link.${this.answer.pageType}`)
                }
                return this.$t(`common:feedCard.answerType.link.link`)
            },
            dateCreatedIso() {
                return format(this.answer.created * 1000, 'YYYY-MM-DDTHH:mm') + 'Z';
            }
        },
        methods: {
            openLink() {
                if (this.hideQuestion) {
                    window.open(this.answer.link)
                } else {
                    this.$router.push({name: 'question-questionId-slug',
                        params: {questionId: this.answer.questionId, slug: this.answer.questionSlug},
                        query: {answerId: this.answer.answerId}})
                }
            }
        }
    }
</script>

<style lang="scss">
    .link-answer-feed-card {
        .link-answer-content {
            .link-preview-image {
                img {
                    cursor: pointer;
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
