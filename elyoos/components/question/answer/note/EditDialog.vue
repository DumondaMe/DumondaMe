<template>
    <v-layout row justify-center>
        <v-dialog v-model="dialog" scrollable persistent max-width="650px">
            <edit-note-dialog @close-dialog="$emit('close-dialog')" :action-button-text="$t('common:button.change')"
                              @finish="editNote" :loading="loading" :init-note-text="noteText">
                <div slot="header">
                    <div id="elyoos-dialog-header">
                        {{$t('pages:detailQuestion.note.editNoteDialog.title', {answer: answerTitle})}}
                    </div>
                    <v-divider></v-divider>
                </div>
            </edit-note-dialog>
        </v-dialog>
    </v-layout>
</template>

<script>
    import EditNoteDialog from './Note';

    export default {
        props: ['answerId', 'noteId', 'noteText', 'answerTitle'],
        data() {
            return {dialog: true, loading: false}
        },
        components: {EditNoteDialog},
        methods: {
            async editNote(text) {
                try {
                    this.loading = true;
                    let response = await this.$axios.$put(`/user/question/answer/note`, {noteId: this.noteId, text});
                    this.$store.commit('question/EDIT_ANSWER_NOTE',
                        {answerId: this.answerId, noteId: this.noteId, text, textHtml: response.textHtml});
                    this.$emit('finish');
                } catch (error) {
                    this.loading = false;
                }
            }
        },
    }
</script>

<style lang="scss">

</style>
