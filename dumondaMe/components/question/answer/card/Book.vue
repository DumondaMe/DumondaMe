<template>
    <div>
        <book-card :hide-question="true" :answer="answer">
            <v-menu bottom slot="feedMenu" v-if="answer.isAdmin">
                <v-btn icon slot="activator">
                    <v-icon>mdi-dots-vertical</v-icon>
                </v-btn>
                <v-list>
                    <v-list-tile @click="showEditAnswerDialog = true">
                        <v-list-tile-title>{{$t('common:button.edit')}}</v-list-tile-title>
                    </v-list-tile>
                    <v-divider></v-divider>
                    <v-list-tile @click="showDeleteAnswerDialog = true">
                        <v-list-tile-title>{{$t('common:button.delete')}}</v-list-tile-title>
                    </v-list-tile>
                </v-list>
            </v-menu>
            <answer-footer slot="footer" :creator="answer.creator" :number-of-up-votes="answer.upVotes"
                           :is-up-voted-by-user="answer.hasVoted" :is-admin="answer.isAdmin" :answer-id="answer.answerId"
                           :number-of-notes="answer.numberOfNotes" :answer-title="answer.title"
                           :notes="answer.notes"
                           @up-voted="(answerId) => $emit('up-voted', answerId)"
                           @down-voted="(answerId) => $emit('down-voted', answerId)"
                           @add-trust-circle="(userId) => $emit('add-trust-circle', userId)"
                           @remove-trust-circle="(userId) => $emit('remove-trust-circle', userId)">
            </answer-footer>
        </book-card>
        <edit-book-dialog v-if="showEditAnswerDialog" @close-dialog="showEditAnswerDialog = false"
                          :init-book="answer" :answer-id="answer.answerId">
        </edit-book-dialog>
        <delete-answer-dialog v-if="showDeleteAnswerDialog" @close-dialog="showDeleteAnswerDialog = false"
                              :answer="answer.title" :answer-id="answer.answerId">
        </delete-answer-dialog>
    </div>
</template>

<script>
    import BookCard from '~/components/feed/card/Book';
    import AnswerFooter from './footer/CommonAnswer';
    import EditBookDialog from '~/components/question/answer/dialog/EditBookDialog'
    import DeleteAnswerDialog from '~/components/question/answer/dialog/DeleteAnswerDialog'

    export default {
        props: ['answer'],
        components: {BookCard, AnswerFooter, EditBookDialog, DeleteAnswerDialog},
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
