<template>
    <div>
        <text-card :hide-question="true" :answer="answer">
            <v-menu bottom slot="feedMenu" v-if="answer.isAdmin">
                <v-btn icon slot="activator">
                    <v-icon>mdi-dots-vertical</v-icon>
                </v-btn>
                <v-list>
                    <v-list-tile @click="showEditTextDialog = true">
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
                           @add-trust-circle="(userId) => $emit('add-trust-circle', userId)"
                           @remove-trust-circle="(userId) => $emit('remove-trust-circle', userId)">
            </answer-footer>
        </text-card>
        <edit-text-dialog v-if="showEditTextDialog" @close-dialog="showEditTextDialog = false"
                          :init-answer="answer.answer" :answer-id="answer.answerId">
        </edit-text-dialog>
        <delete-answer-dialog v-if="showDeleteAnswerDialog" @close-dialog="showDeleteAnswerDialog = false"
                              :answer="answer.title" :answer-id="answer.answerId">
        </delete-answer-dialog>
    </div>
</template>

<script>
    import TextCard from '~/components/feed/card/Text';
    import AnswerFooter from './footer/CommonAnswer';
    import EditTextDialog from '~/components/question/answer/dialog/EditTextDialog'
    import DeleteAnswerDialog from '~/components/question/answer/dialog/DeleteAnswerDialog'

    export default {
        props: ['answer'],
        components: {TextCard, AnswerFooter, EditTextDialog, DeleteAnswerDialog},
        data() {
            return {showDeleteAnswerDialog: false, showEditTextDialog: false}
        }
    }
</script>

<style lang="scss">

</style>
