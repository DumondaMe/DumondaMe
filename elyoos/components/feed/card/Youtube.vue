<template>
    <div class="youtube-answer-feed-card">
        <div class="youtube-answer-content" ref="answerContent" :class="{'show-embed': showEmbed}">
            <div class="feed-card-header">
                <span class="answer-type">Video </span><span class="card-header-link">
                <nuxt-link :to="{name: 'question-questionId-slug',
                            params: {questionId: answer.questionId, slug: answer.questionSlug},
                            query: {answerId: answer.answerId}}"> {{answer.title}}
                </nuxt-link></span>
                <div class="secondary-text">{{answer.created | formatRelativeTimesAgo}}</div>
            </div>
            <div class="youtube-embed">
                <iframe :width="youtubeWidth" :height="youtubeHeight" :src="youtubeEmbedAutoplay" frameBorder="0"
                        v-if="showEmbed"></iframe>
                <img :src="youtubeImage" v-else @click="showEmbed = true">
            </div>
            <div class="answer-description">
                <expand-text :expand-text="answer.description"
                             itemprop="text">
                </expand-text>
            </div>
        </div>
        <card-footer :creator="answer.creator" :user="answer.user" :action="answer.action" :card-type="answer.type">
        </card-footer>
    </div>
</template>

<script>
    import CardFooter from './footer/CommonAnswer';
    import ExpandText from '~/components/common/text/Expand.vue'

    export default {
        props: ['answer'],
        components: {CardFooter, ExpandText},
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
                let indexList = this.answer.linkEmbed.indexOf('?list=');
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
