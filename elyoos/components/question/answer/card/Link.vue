<template>
    <div>
        <link-card :hide-question="true" :answer="answer">
            <v-menu bottom slot="feedMenu" v-if="answer.isAdmin">
                <v-btn icon slot="activator">
                    <v-icon>mdi-dots-vertical</v-icon>
                </v-btn>
                <v-list>
                    <v-list-tile @click="openEditLinkDialog()">
                        <v-list-tile-title>{{$t('common:button.edit')}}</v-list-tile-title>
                    </v-list-tile>
                    <v-divider></v-divider>
                    <v-list-tile @click="showDeleteAnswerDialog = true">
                        <v-list-tile-title>{{$t('common:button.delete')}}</v-list-tile-title>
                    </v-list-tile>
                </v-list>
            </v-menu>
            <answer-footer slot="footer" :creator="answer.creator" :number-of-up-votes="answer.upVotes"
                           :has-voted="answer.hasVoted" :is-admin="answer.isAdmin" :answer-id="answer.answerId"
                           :number-of-notes="answer.numberOfNotes" :answer-title="answer.title"
                           :notes="answer.notes">
            </answer-footer>
        </link-card>
        <edit-link-dialog v-if="showEditAnswerDialog" @close-dialog="showEditAnswerDialog = false"
                          :init-link="answer.link" :init-link-data="answer" :answer-id="answer.answerId">
        </edit-link-dialog>
        <delete-answer-dialog v-if="showDeleteAnswerDialog" @close-dialog="showDeleteAnswerDialog = false"
                              :answer="answer.title" :answer-id="answer.answerId">
        </delete-answer-dialog>
    </div>
</template>

<script>
    import LinkCard from '~/components/feed/card/Link';
    import AnswerFooter from './footer/CommonAnswer';
    import EditLinkDialog from '~/components/question/answer/dialog/EditLinkDialog'
    import DeleteAnswerDialog from '~/components/question/answer/dialog/DeleteAnswerDialog'

    export default {
        props: ['answer'],
        components: {LinkCard, AnswerFooter, EditLinkDialog, DeleteAnswerDialog},
        data() {
            return {showDeleteAnswerDialog: false, showEditAnswerDialog: false}
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

</style>
