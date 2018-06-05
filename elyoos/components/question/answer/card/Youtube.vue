<template>
    <div class="ely-card youtube-answer-card" :id="'card-' + answer.answerId"
         :class="{'new-added-answer': answer.newAddedAnswer}">
        <v-layout row class="text-answer-header">
            <user-info :name="answer.creator.name" :thumbnail-url="answer.creator.thumbnailUrl"
                       :created="answer.created" :isAdmin="answer.isAdmin" :link="answer.link"
                       :answer-type-translated="$t('pages:detailQuestion.answerType.video')"
                       :answer-type="answer.answerType" :answer-title="answer.title" :userId="answer.creator.userId"
                       :slug="answer.creator.slug">
            </user-info>
            <v-spacer></v-spacer>
            <v-menu bottom v-if="answer.isAdmin">
                <v-btn icon slot="activator">
                    <v-icon>mdi-dots-vertical</v-icon>
                </v-btn>
                <v-list>
                    <v-list-tile @click="openEditLinkDialog()">
                        <v-list-tile-title>Bearbeiten</v-list-tile-title>
                    </v-list-tile>
                    <v-divider></v-divider>
                    <v-list-tile @click="showDeleteAnswerDialog = true">
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
            <expand-text :expand-text="answer.description" class="answer-description"
                         :class="{'show-embed': showEmbed}" itemprop="text">
            </expand-text>
        </div>
        <answer-footer :answer="answer"></answer-footer>
        <edit-link-dialog v-if="showEditAnswerDialog" @close-dialog="showEditAnswerDialog = false" :is-video="true"
                          :init-link="answer.link" :init-link-data="answer" :answer-id="answer.answerId">
        </edit-link-dialog>
        <delete-answer-dialog v-if="showDeleteAnswerDialog" @close-dialog="showDeleteAnswerDialog = false"
                              :answer="answer.title" :answer-id="answer.answerId">
        </delete-answer-dialog>
    </div>
</template>

<script>
    import UserInfo from './UserInfo.vue';
    import AnswerFooter from './Footer';
    import ExpandText from '~/components/common/text/Expand.vue'
    import EditLinkDialog from '~/components/question/answer/dialog/EditLinkDialog'
    import DeleteAnswerDialog from '~/components/question/answer/dialog/DeleteAnswerDialog'

    export default {
        props: ['answer'],
        components: {UserInfo, AnswerFooter, ExpandText, EditLinkDialog, DeleteAnswerDialog},
        data() {
            return {showEmbed: false, showDeleteAnswerDialog: false, showEditAnswerDialog: false}
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
        },
        methods: {
            openEditLinkDialog() {
                this.answer.type = 'Youtube';
                this.showEditAnswerDialog = true;
            }
        },
    }
</script>

<style lang="scss">
    .youtube-answer-card {
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
                display: block;
                margin-left: 138px;
            }
            .answer-description.show-embed {
                margin-left: 0;
            }
        }
    }
</style>
