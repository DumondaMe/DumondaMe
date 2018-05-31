<template>
    <div class="ely-card commitment-answer-card" :id="'card-' + answer.answerId"
         :class="{'new-added-answer': answer.newAddedAnswer}">
        <v-layout row>
            <user-info :name="answer.creator.name" :thumbnail-url="answer.creator.thumbnailUrl"
                       :created="answer.created" :isAdmin="answer.isAdmin" :answer-type="answer.answerType"
                       :answer-type-translated="$t('pages:detailQuestion.answerType.commitment')"
                       :answer-title="answer.title" :userId="answer.creator.userId" :slug="answer.creator.slug"
                       :commitment-id="answer.commitmentId" :commitment-slug="answer.commitmentSlug"
                       :regions="answer.regions">
            </user-info>
            <v-spacer></v-spacer>
            <v-menu bottom v-if="answer.isAdmin">
                <v-btn icon slot="activator">
                    <v-icon>mdi-dots-vertical</v-icon>
                </v-btn>
                <v-list>
                    <v-list-tile @click="showEditCommitmentDialog = true">
                        <v-list-tile-title>Bearbeiten</v-list-tile-title>
                    </v-list-tile>
                    <v-divider></v-divider>
                    <v-list-tile @click="showDeleteAnswerDialog = true">
                        <v-list-tile-title>Löschen</v-list-tile-title>
                    </v-list-tile>
                </v-list>
            </v-menu>
        </v-layout>
        <div class="commitment-answer-content">
            <div class="commitment-preview-image">
                <img :src="answer.imageUrl">
            </div>
            <expand-text :expand-text="answer.description" class="answer-description"
                         :class="{'no-book-image': !answer.imageUrl}" itemprop="text">
            </expand-text>
        </div>
        <answer-footer :answer="answer">
        </answer-footer>
        <events-footer :events="answer.events" v-if="answer.events.length > 0">
        </events-footer>
        <edit-commitment-dialog v-if="showEditCommitmentDialog" @close-dialog="showEditCommitmentDialog = false"
                                :init-commitment="answer" :answer-id="answer.answerId">
        </edit-commitment-dialog>
        <delete-answer-dialog v-if="showDeleteAnswerDialog" @close-dialog="showDeleteAnswerDialog = false"
                              :answer="answer.title" :answer-id="answer.answerId">
        </delete-answer-dialog>
    </div>
</template>

<script>
    import UserInfo from './UserInfo.vue';
    import AnswerFooter from './Footer';
    import EventsFooter from './FooterEvents';
    import ExpandText from '~/components/common/text/Expand.vue';
    import EditCommitmentDialog from '~/components/question/answer/dialog/EditCommitmentDialog';
    import DeleteAnswerDialog from '~/components/question/answer/dialog/DeleteAnswerDialog';

    export default {
        props: ['answer'],
        components: {UserInfo, AnswerFooter, EventsFooter, ExpandText, EditCommitmentDialog, DeleteAnswerDialog},
        data() {
            return {showDeleteAnswerDialog: false, showEditCommitmentDialog: false}
        },
        computed: {
            getExternalLink() {
                let title = this.answer.title.replace(' ', '+');
                let authors = this.answer.authors.replace(',', '+');
                authors = this.answer.authors.replace(' ', '+');
                return `https://duckduckgo.com/?q="${title}"+${authors}&t=hf&ia=web`;
            }
        }
    }
</script>

<style lang="scss">
    .commitment-answer-card {
        margin-bottom: 12px;

        .commitment-answer-content {
            min-height: 90px;
            display: flex;
            .commitment-preview-image {
                img {
                    margin-top: 19px;
                    width: 120px;
                    height: 120px;
                    border-radius: 2px;
                }
            }
            .answer-description {
                margin-left: 18px;
                margin-top: 13px;
            }
            .answer-description.no-book-image {
                margin-left: 0;
            }
        }
    }
</style>
