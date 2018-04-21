<template>
    <div class="youtube-answer-feed-card">
        <v-layout row class="text-answer-header">
            <user-info :name="answer.creator.name" :thumbnail-url="answer.creator.thumbnailUrl"
                       :created="answer.created" :isAdmin="answer.isAdmin" :link="answer.link"
                       :card-type-translated="$t('pages:detailQuestion.answerType.video')"
                       :card-type="answer.answerType" :answer-title="answer.title" :userId="answer.creator.userId"
                       :question-id="answer.questionId" :question-slug="answer.questionSlug" :question="answer.question"
                       :slug="answer.creator.slug">
            </user-info>
            <v-spacer></v-spacer>
            <v-menu bottom v-if="answer.isAdmin">
                <v-btn icon slot="activator">
                    <v-icon>more_vert</v-icon>
                </v-btn>
                <v-list>
                    <v-list-tile @click="">
                        <v-list-tile-title>Bearbeiten</v-list-tile-title>
                    </v-list-tile>
                    <v-divider></v-divider>
                    <v-list-tile @click="">
                        <v-list-tile-title>Löschen</v-list-tile-title>
                    </v-list-tile>
                </v-list>
            </v-menu>
        </v-layout>
        <div class="youtube-answer-content" ref="answerContent">
            <div class="youtube-embed" :class="{'show-embed': showEmbed}">
                <iframe :width="youtubeWidth" :height="youtubeHeight" :src="youtubeEmbedAutoplay" frameBorder="0"
                        v-if="showEmbed"></iframe>
                <img :src="youtubeImage" v-else @click="showEmbed = true">
            </div>
            <expand-text :expand-text="answer.description" :class="{'show-embed': showEmbed}" class="answer-description"
                         itemprop="text">
            </expand-text>
        </div>
    </div>
</template>

<script>
    import UserInfo from './UserInfo.vue';
    import ExpandText from '~/components/common/text/Expand.vue'

    export default {
        props: ['answer'],
        components: {UserInfo, ExpandText},
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
            }
        }
    }
</script>

<style lang="scss">
    .youtube-answer-feed-card {
        margin-bottom: 12px;

        .youtube-answer-content {
            min-height: 100px;
            .youtube-embed {
                float: left;
                img {
                    margin-top: 5px;
                    max-height: 90px;
                    max-width: 120px;
                    cursor: pointer;
                    border-radius: 2px;
                }
            }
            .youtube-embed.show-embed {
                display: block;
                float: none;
                margin: 12px auto 0 auto;
            }
            .answer-description {
                margin-top: 12px;
                margin-left: 138px;
            }
            .answer-description.show-embed {
                margin-left: 0;
            }
        }
    }
</style>
