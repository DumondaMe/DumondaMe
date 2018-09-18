<template>
    <div class="youtube-answer-feed-card">
        <div class="youtube-answer-content" ref="answerContent" :class="{'show-embed': showEmbed}">
            <div class="feed-card-header">
                <div>
                    <div v-if="!hideQuestion">
                        <span class="answer-type">{{$t('common:feedCard.answerType.video')}} </span><span
                            class="card-header-link">
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
                        <span class="answer-type">{{$t('common:feedCard.answerType.video')}} </span>
                        <span class="card-header-link"><a target="_blank" :href="answer.link"
                                                          class="link">{{answer.title}} </a></span>
                    </div>
                    <div class="secondary-text">{{answer.created | formatRelativeTimesAgo}}</div>
                </div>
                <v-spacer></v-spacer>
                <slot name="feedMenu"></slot>
            </div>
            <div class="youtube-embed">
                <iframe :width="youtubeWidth" :height="youtubeHeight" :src="youtubeEmbedAutoplay" frameBorder="0"
                        allow="autoplay" v-if="showEmbed"></iframe>
                <img :src="youtubeImage" v-else @click="showEmbed = true">
            </div>
            <div class="answer-description">
                <expand-text :expand-text="answer.description"
                             itemprop="text">
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
            return {showEmbed: false}
        },
        computed: {
            isAuthenticated() {
                return this.$store.state.auth.userIsAuthenticated
            },
            youtubeImage() {
                return `https://img.youtube.com/vi/${this.answer.idOnYoutube}/0.jpg`;
            },
            youtubeEmbedAutoplay() {
                let indexList = this.answer.linkEmbed.indexOf('embed?');
                if (indexList !== -1) {
                    return this.answer.linkEmbed + '&autoplay=1';
                }
                return this.answer.linkEmbed + '?autoplay=1';
            },
            youtubeWidth() {
                return this.$refs.answerContent.clientWidth;
            },
            youtubeHeight() {
                return this.$refs.answerContent.clientWidth * 0.6;
            }
        }
    }
</script>

<style lang="scss">
    .youtube-answer-feed-card {
        .youtube-answer-content {
            margin-bottom: 16px;
            .youtube-embed {
                width: 100%;
                img {
                    width: 100%;
                    cursor: pointer;
                    border-radius: 4px;
                }
            }
            .youtube-embed.show-embed {
                margin: 12px auto 0 auto;
            }
        }
        .youtube-answer-content.show-embed {
            display: block;
            .youtube-embed {
                margin: 0 auto 12px auto;
            }
            .answer-description {
                margin-left: 0;
            }
        }
    }
</style>
