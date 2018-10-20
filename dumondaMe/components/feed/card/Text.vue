<template>
    <div class="text-answer-feed-card">
        <div class="feed-card-header">
            <div>
                <h2 class="feed-card-title">
                    <span class="answer-type"
                      v-if="!hideQuestion">
                    <span>{{$t('common:feedCard.answerType.textWithQuestion1')}} </span>
                    <span class="creator-name" @click="goToProfile()">{{creator.name}} </span>
                    <span>{{$t('common:feedCard.answerType.textWithQuestion2')}} </span>
                    </span>
                    <span class="answer-type" v-else>{{$t('common:feedCard.answerType.text')}}</span>
                    <span class="card-header-link">
                    <nuxt-link :to="{name: 'question-questionId-slug',
                            params: {questionId: answer.questionId, slug: answer.questionSlug},
                            query: {answerId: answer.answerId}}"> {{answer.question}}
                    </nuxt-link></span>
                </h2>
                <div class="secondary-text">{{answer.created | formatRelativeTimesAgo}}</div>
            </div>
            <v-spacer></v-spacer>
            <slot name="feedMenu"></slot>
        </div>
        <expand-text :expand-text="answer.answer" class="answer-description" itemprop="text">
        </expand-text>
        <slot name="footer"></slot>
    </div>
</template>

<script>
    import ExpandText from '~/components/common/text/Expand.vue'

    export default {
        props: ['answer', 'hideQuestion', 'creator'],
        components: {ExpandText},
        methods: {
            goToProfile() {
                if (this.creator.isLoggedInUser) {
                    this.$router.push({name: 'user'});
                } else {
                    this.$router.push({
                        name: 'user-userId-slug', params: {userId: this.creator.userId, slug: this.creator.slug}
                    })
                }
            }
        }
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
        .creator-name {
            color: $primary-color;
            font-weight: 400;
            cursor: pointer;
        }
        :hover.creator-name {
            text-decoration: underline;
        }
    }
</style>
