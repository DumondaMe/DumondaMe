<template>
    <div>
        <commitment-card :hide-question="true" :answer="answer">
            <v-menu bottom slot="feedMenu" v-if="answer.isAdmin">
                <v-btn icon slot="activator">
                    <v-icon>mdi-dots-vertical</v-icon>
                </v-btn>
                <v-list>
                    <v-list-tile @click="showEditCommitmentDialog = true">
                        <v-list-tile-title>{{$t('common:button.edit')}}</v-list-tile-title>
                    </v-list-tile>
                    <v-divider></v-divider>
                    <v-list-tile @click="showDeleteAnswerDialog = true">
                        <v-list-tile-title>{{$t('common:button.delete')}}</v-list-tile-title>
                    </v-list-tile>
                </v-list>
            </v-menu>
            <answer-footer slot="footer" :creator="answer.creator" :number-of-up-votes="answer.upVotes"
                           :has-voted="answer.hasVoted" :is-admin="answer.isAdmin"
                           :answer-id="answer.answerId" :regions="answer.regions">
            </answer-footer>
        </commitment-card>
        <edit-commitment-dialog v-if="showEditCommitmentDialog" @close-dialog="showEditCommitmentDialog = false"
                                :init-commitment="answer" :answer-id="answer.answerId">
        </edit-commitment-dialog>
        <delete-answer-dialog v-if="showDeleteAnswerDialog" @close-dialog="showDeleteAnswerDialog = false"
                              :answer="answer.title" :answer-id="answer.answerId">
        </delete-answer-dialog>
    </div>
</template>

<script>
    import CommitmentCard from '~/components/feed/card/Commitment';
    import AnswerFooter from './footer/CommitmentAnswer';
    import EditCommitmentDialog from '~/components/question/answer/dialog/EditCommitmentDialog';
    import DeleteAnswerDialog from '~/components/question/answer/dialog/DeleteAnswerDialog'

    export default {
        props: ['answer'],
        components: {CommitmentCard, AnswerFooter, EditCommitmentDialog, DeleteAnswerDialog},
        data() {
            return {showDeleteAnswerDialog: false, showEditCommitmentDialog: false}
        }
    }
</script>

<style lang="scss">

</style>
