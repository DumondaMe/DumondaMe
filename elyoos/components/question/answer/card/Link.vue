<template>
    <div class="ely-card link-answer-card" :id="'card-' + answer.answerId"
         :class="{'new-added-answer': answer.newAddedAnswer}">
        <v-layout row>
            <user-info :name="answer.creator.name" :thumbnail-url="answer.creator.thumbnailUrl"
                       :created="answer.created" :isAdmin="answer.isAdmin" :answer-type="answer.answerType"
                       :answer-type-translated="answerType" :answer-title="answer.title" :link="answer.link"
                       :userId="answer.creator.userId" :slug="answer.creator.slug">
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
        <div class="link-answer-content">
            <div class="link-preview-image" v-if="answer.imageUrl">
                <img :src="answer.imageUrl">
            </div>
            <expand-text :expand-text="answer.description" class="answer-description"
                         :class="{'no-link-image': !answer.imageUrl}" itemprop="text">
            </expand-text>
        </div>
        <answer-footer :answer="answer">
        </answer-footer>
        <edit-link-dialog v-if="showEditAnswerDialog" @close-dialog="showEditAnswerDialog = false"
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
            return {showDeleteAnswerDialog: false, showEditAnswerDialog: false}
        },
        computed: {
            answerType() {
                if (this.answer.pageType) {
                    return this.$t(`pages:detailQuestion.answerType.link.${this.answer.pageType}`)
                }
                return this.$t(`pages:detailQuestion.answerType.link.link`)
            }
        },
        methods: {
            openEditLinkDialog() {
                this.answer.type = 'Link';
                this.showEditAnswerDialog = true;
            }
        }
    }
</script>

<style lang="scss">
    .link-answer-card {
        margin-bottom: 12px;

        .link-answer-content {
            min-height: 90px;
            display: flex;
            .link-preview-image {
                img {
                    border-radius: 2px;
                    margin-top: 5px;
                    max-width: 120px;
                }
            }
            .answer-description {
                margin-left: 18px;
            }
            .answer-description.no-link-image {
                margin-left: 0;
            }
        }
    }
</style>
