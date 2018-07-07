<template>
    <div class="youtube-answer-feed-card">
        <div class="youtube-answer-content" ref="answerContent" :class="{'show-embed': showEmbed}">
            <div class="youtube-embed">
                <iframe :width="youtubeWidth" :height="youtubeHeight" :src="youtubeEmbedAutoplay" frameBorder="0"
                        v-if="showEmbed"></iframe>
                <img :src="youtubeImage" v-else @click="showEmbed = true">
            </div>
            <div class="answer-description">
                <div class="title-container">
                    <v-icon class="card-type-icon">mdi-video</v-icon>
                    <span class="card-title"><a :href="getQuestionLink">{{answer.title}}</a></span>
                </div>
                <question-to-answer :question-id="answer.questionId" :question-slug="answer.questionSlug"
                                    :question="answer.question">
                </question-to-answer>
                <expand-text :expand-text="answer.description"
                             itemprop="text">
                </expand-text>
            </div>
        </div>
        <card-footer :creator="answer.creator.name" :creator-id="answer.creator.userId"
                     :creator-slug="answer.creator.slug" :created="answer.created" :action="answer.action"
                     :card-type="answer.type">
        </card-footer>
    </div>
</template>

<script>
    import CardFooter from './footer/CommonAnswer';
    import QuestionToAnswer from './QuestionToAnswer';
    import ExpandText from '~/components/common/text/Expand.vue'

    export default {
        props: ['answer'],
        components: {CardFooter, QuestionToAnswer, ExpandText},
        data() {
            return {showEmbed: false}
        },
        computed: {
            isAuthenticated() {
                return this.$store.state.auth.userIsAuthenticated
            },
            youtubeImage() {
                return `https://img.youtube.com/vi/${this.answer.idOnYoutube}/1.jpg`;
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
            },
            getQuestionLink() {
                return `/question/${this.answer.questionId}/${this.answer.questionSlug}?answerId=${this.answer.answerId}`;
            }
        }
    }
</script>

<style lang="scss">
    .youtube-answer-feed-card {
        .youtube-answer-content {
            display: flex;
            margin-bottom: 16px;
            .youtube-embed {
                img {
                    margin-top: 5px;
                    max-height: 90px;
                    max-width: 120px;
                    cursor: pointer;
                    border-radius: 2px;
                }
            }
            .youtube-embed.show-embed {
                margin: 12px auto 0 auto;
            }
            .answer-description {
                margin-left: 18px;
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
