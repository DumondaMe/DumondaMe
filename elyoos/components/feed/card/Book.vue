<template>
    <div class="book-answer-feed-card">
        <div class="feed-card-header">
            <div v-if="!hideQuestion">
                <span class="answer-type">{{$t('common:feedCard.answerType.book')}} </span>
                <span class="card-header-link"><nuxt-link :to="{name: 'question-questionId-slug',
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
                <span class="answer-type">{{$t('common:feedCard.answerType.book')}} </span>
                <span class="card-header-link"><a target="_blank" :href="link"
                                                  class="link">{{answer.title}} </a></span>
            </div>
            <div class="secondary-text">{{answer.created | formatRelativeTimesAgo}}</div>
        </div>
        <div class="book-answer-content" :class="{'no-book-image': !answer.imageUrl}">
            <div class="book-preview-image" v-if="answer.imageUrl">
                <img :src="answer.imageUrl">
            </div>
            <div class="answer-description">
                <expand-text :expand-text="answer.description"
                             :class="{'no-book-image': !answer.imageUrl}" itemprop="text">
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
        },
        computed: {
            link() {
                return `http://books.google.com/books?vid=${this.answer.googleBookId}`;
            }
        }
    }
</script>

<style lang="scss">
    .book-answer-feed-card {
        .book-answer-content {
            min-height: 90px;
            display: flex;
            margin-bottom: 16px;
            .book-preview-image {
                img {
                    border-radius: 2px;
                    margin-top: 6px;
                    max-height: 250px;
                    max-width: 120px;
                }
            }
            .answer-description {
                margin-left: 18px;
                p {
                    max-height: 11.2em;
                }
            }
            .answer-description.no-book-image {
                margin-left: 0;
            }
        }
        .book-answer-content.no-book-image {
            min-height: 0;
        }
    }
</style>
