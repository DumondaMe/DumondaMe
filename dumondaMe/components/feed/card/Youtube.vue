<template>
    <div class="youtube-answer-feed-card">
        <div class="youtube-answer-content" ref="answerContent" :class="{'show-embed': showEmbed}">
            <div class="feed-card-header">
                <div>
                    <h2 class="feed-card-title">
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
                            <span class="card-header-link"><a target="_blank" rel="noopener" :href="answer.link"
                                                              class="link">{{answer.title}} </a></span>
                        </div>
                    </h2>
                    <time class="secondary-text" itemprop="dateCreated" :datetime="dateCreatedIso">
                        {{answer.created | formatRelativeTimesAgo}}
                    </time>
                </div>
                <v-spacer></v-spacer>
                <slot name="feedMenu"></slot>
            </div>
            <div class="youtube-embed">
                <iframe :width="youtubeWidth" :height="youtubeHeight" :src="youtubeEmbedAutoplay" frameBorder="0"
                        allow="autoplay" v-if="showEmbed"></iframe>
                <img v-lazy="youtubeImage" @loaded="showVideoButton = true" v-else @click="showEmbed = true">
                <img :src="videoButton" v-if="!showEmbed && showVideoButton" class="video-button"
                     @click="showEmbed = true">
            </div>
            <div class="answer-description">
                <expand-text :expand-text="answer.descriptionHtml"></expand-text>
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
        data() {
            return {showEmbed: false, showVideoButton: false}
        },
        mounted() {
            this.$Lazyload.$on('loaded', this.imageLoaded);
        },
        computed: {
            isAuthenticated() {
                return this.$store.state.auth.userIsAuthenticated
            },
            youtubeImage() {
                return `https://img.youtube.com/vi/${this.answer.idOnYoutube}/0.jpg`;
            },
            videoButton() {
                return `${process.env.staticUrl}/img/youtube.png`;
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
            },
            dateCreatedIso() {
                return format(this.answer.created * 1000, 'YYYY-MM-DDTHH:mm') + 'Z';
            }
        },
        methods: {
            imageLoaded({src}) {
                if (src === this.youtubeImage) {
                    this.showVideoButton = true;
                    this.$Lazyload.$off('loaded', this.imageLoaded);
                }
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
                position: relative;

                img {
                    width: 100%;
                    cursor: pointer;
                    border-top: 1px solid $divider;
                    border-bottom: 1px solid $divider;
                }

                img.video-button {
                    position: absolute;
                    left: 50%;
                    top: 50%;
                    width: 70px;
                    margin-left: -35px;
                    margin-top: -25px;
                    border: none;

                    @media screen and (max-width: 900px) {
                        width: 60px;
                        margin-left: -30px;
                        margin-top: -21px;
                    }
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

        .answer-description {
            margin-top: 8px;
            @include defaultPaddingCard();
        }
    }
</style>
