<template>
    <div class="commitment-answer-feed-card">
        <div class="feed-card-header">
            <div>
                <h2 class="feed-card-title">
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
                </h2>
                <time class="secondary-text" v-if="!hideTime" itemprop="dateCreated" :datetime="dateCreatedIso">
                    {{answer.created | formatRelativeTimesAgo}}
                </time>
            </div>
            <v-spacer></v-spacer>
            <slot name="feedMenu"></slot>
        </div>
        <div class="commitment-answer-content">
            <div class="commitment-preview-image">
                <img v-lazy="answer.imageUrl" @click="$router.push({name: 'commitment-commitmentId-slug',
                            params: {commitmentId: answer.commitmentId, slug: answer.commitmentSlug}})">
            </div>
            <div class="answer-description">
                <expand-text :expand-text="answer.descriptionHtml"
                             :class="{'no-commitment-image': !answer.imageUrl}">
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
        props: ['answer', 'hideQuestion', 'hideTime'],
        components: {ExpandText},
        data() {
            return {expandDescription: false}
        },
        computed: {
            dateCreatedIso() {
                return format(this.answer.created * 1000, 'YYYY-MM-DDTHH:mm') + 'Z';
            }
        },
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
                    border-top: 1px solid $divider;
                    border-bottom: 1px solid $divider;
                }
            }
            .answer-description {
                margin-top: 8px;
                word-wrap: break-word;
                @include defaultPaddingCard();
            }
            .answer-description.no-commitment-image {
                margin-left: 0;
            }
        }
    }
</style>
