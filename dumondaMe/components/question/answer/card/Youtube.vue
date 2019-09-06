<template>
    <div>
        <youtube-card :hide-question="true" :answer="answer">
            <v-menu bottom slot="feedMenu" v-if="answer.isAdmin">
                <template v-slot:activator="{ on }">
                    <v-btn icon v-on="on">
                        <v-icon>mdi-dots-vertical</v-icon>
                    </v-btn>
                </template>
                <v-list>
                    <v-list-item @click="openEditYoutubeDialog()">
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
                           :answer-id="answer.answerId" :number-of-notes="answer.numberOfNotes"
                           :answer-title="answer.title" :notes="answer.notes"
                           @up-voted="(answerId) => $emit('up-voted', answerId)"
                           @down-voted="(answerId) => $emit('down-voted', answerId)"
                           @add-trust-circle="(userId) => $emit('add-trust-circle', userId)"
                           @remove-trust-circle="(userId) => $emit('remove-trust-circle', userId)">
            </answer-footer>
        </youtube-card>
        <edit-link-dialog v-if="showEditAnswerDialog" @close-dialog="showEditAnswerDialog = false" :is-video="true"
                          :init-link="answer.link" :init-link-data="answer" :answer-id="answer.answerId"
                          init-type="Youtube">
        </edit-link-dialog>
        <delete-answer-dialog v-if="showDeleteAnswerDialog" @close-dialog="showDeleteAnswerDialog = false"
                              :answer="answer.title" :answer-id="answer.answerId">
        </delete-answer-dialog>
    </div>
</template>

<script>
    import YoutubeCard from '~/components/feed/card/Youtube'
    import AnswerFooter from './footer/CommonAnswer';
    import EditLinkDialog from '~/components/question/answer/dialog/EditLinkDialog'
    import DeleteAnswerDialog from '~/components/question/answer/dialog/DeleteAnswerDialog'

    export default {
        props: ['answer'],
        components: {YoutubeCard, AnswerFooter, EditLinkDialog, DeleteAnswerDialog},
        data() {
            return {showDeleteAnswerDialog: false, showEditAnswerDialog: false}
        },
        methods: {
            openEditYoutubeDialog() {
                this.showEditAnswerDialog = true;
            }
        }
    }
</script>

<style lang="scss">

</style>
