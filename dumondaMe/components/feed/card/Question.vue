<template>
    <div class="question-feed-card">
        <div class="feed-card-header">
            <div>
                <h2 class="feed-card-title">
                    <span class="answer-type">{{$t('common:question')}} </span><span class="card-header-link">
                    <nuxt-link :to="{name: 'question-questionId-slug',
                            params: {questionId: question.questionId, slug: slug}}"> {{question.question}}
                    </nuxt-link></span>
                </h2>
                <div class="secondary-text" v-if="!hideTime">{{question.created | formatRelativeTimesAgo}}</div>
            </div>
        </div>
        <expand-text :expand-text="question.descriptionHtml" class="question-description" itemprop="text">
        </expand-text>
        <slot name="footer"></slot>
    </div>
</template>

<script>
    import CardFooter from './footer/Question';
    import ExpandText from '~/components/common/text/Expand.vue'

    export default {
        props: ['question', 'hideTime'],
        components: {CardFooter, ExpandText},
        computed: {
            slug() {
                if (this.question.questionSlug) {
                    return this.question.questionSlug;
                } else if (this.question.slug) {
                    return this.question.slug;
                }
                return '';
            }
        }
    }
</script>

<style lang="scss">
    .question-feed-card {
        .question-description {
            margin-top: 12px;
            margin-bottom: 16px;
            @include defaultPaddingCard();
        }

        .question-header {
            display: block;
            line-height: 16px;

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
