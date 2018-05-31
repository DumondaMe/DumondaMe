<template>
    <div class="ely-card text-answer-card" :id="'card-' + answer.answerId"
         :class="{'new-added-answer': answer.newAddedAnswer}">
        <v-layout row class="text-answer-header">
            <user-info :name="answer.creator.name" :thumbnail-url="answer.creator.thumbnailUrl"
                       :isAdmin="answer.isAdmin" :created="answer.created" :answer-type="answer.answerType"
                       :answer-type-translated="$t('pages:detailQuestion.answerType.text')"
                       :userId="answer.creator.userId" :slug="answer.creator.slug">
            </user-info>
            <v-spacer></v-spacer>
            <v-menu bottom v-if="answer.isAdmin">
                <v-btn icon slot="activator">
                    <v-icon>mdi-dots-vertical</v-icon>
                </v-btn>
                <v-list>
                    <v-list-tile @click="showEditTextDialog = true">
                        <v-list-tile-title>Bearbeiten</v-list-tile-title>
                    </v-list-tile>
                    <v-divider></v-divider>
                    <v-list-tile @click="showDeleteAnswerDialog = true">
                        <v-list-tile-title>Löschen</v-list-tile-title>
                    </v-list-tile>
                </v-list>
            </v-menu>
        </v-layout>
        <expand-text :expand-text="answer.answer" class="answer-description" itemprop="text">
        </expand-text>
        <answer-footer :answer="answer"></answer-footer>
        <edit-text-dialog v-if="showEditTextDialog" @close-dialog="showEditTextDialog = false"
                          :init-answer="answer.answer" :answer-id="answer.answerId">
        </edit-text-dialog>
        <delete-answer-dialog v-if="showDeleteAnswerDialog" @close-dialog="showDeleteAnswerDialog = false"
                              :answer="answer.answer" :answer-id="answer.answerId">
        </delete-answer-dialog>
    </div>
</template>

<script>
    import UserInfo from './UserInfo';
    import AnswerFooter from './Footer';
    import ExpandText from '~/components/common/text/Expand'
    import EditTextDialog from '~/components/question/answer/dialog/EditTextDialog'
    import DeleteAnswerDialog from '~/components/question/answer/dialog/DeleteAnswerDialog'

    export default {
        props: ['answer'],
        components: {UserInfo, AnswerFooter, ExpandText, EditTextDialog, DeleteAnswerDialog},
        data() {
            return {showEditTextDialog: false, showDeleteAnswerDialog: false}
        },
        computed: {
            isAuthenticated() {
                return this.$store.state.auth.userIsAuthenticated
            }
        },
    }
</script>

<style lang="scss">
    .text-answer-card {
        margin-bottom: 12px;
        .answer-description {
            margin-top: 12px;
            font-weight: 300;
            font-size: 16px;
            white-space: pre-wrap;
            line-height: 1.6em;
        }
    }
</style>
