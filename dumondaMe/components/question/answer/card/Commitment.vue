<template>
    <div>
        <commitment-card :hide-question="true" :answer="answer">
            <v-menu bottom slot="feedMenu" v-if="answer.isAdmin">
                <template v-slot:activator="{ on }">
                    <v-btn icon v-on="on">
                        <v-icon>mdi-dots-vertical</v-icon>
                    </v-btn>
                </template>
                <v-list>
                    <v-list-item @click="showEditCommitmentDialog = true">
                        <v-list-item-title>{{$t('common:button.edit')}}</v-list-item-title>
                    </v-list-item>
                    <v-divider></v-divider>
                    <v-list-item @click="showDeleteAnswerDialog = true">
                        <v-list-item-title>{{$t('common:button.delete')}}</v-list-item-title>
                    </v-list-item>
                </v-list>
            </v-menu>
            <answer-footer slot="footer" :creator="answer.creator" :number-of-up-votes="answer.upVotes"
                           :is-up-voted-by-user="answer.hasVoted" :is-admin="answer.isAdmin"
                           :answer-id="answer.answerId" :regions="answer.regions"
                           @up-voted="(answerId) => $emit('up-voted', answerId)"
                           @down-voted="(answerId) => $emit('down-voted', answerId)"
                           @add-trust-circle="(userId) => $emit('add-trust-circle', userId)"
                           @remove-trust-circle="(userId) => $emit('remove-trust-circle', userId)">
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
