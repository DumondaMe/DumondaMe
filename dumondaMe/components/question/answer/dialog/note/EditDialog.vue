<template>
    <div>
        <v-dialog v-model="dialog" scrollable persistent max-width="650px" :fullscreen="$vuetify.breakpoint.xsOnly">
            <edit-note-dialog @close-dialog="$emit('close-dialog')" :action-button-text="$t('common:button.change')"
                              @finish="editNote" :loading="loading" :init-note-text="noteText">
                <div slot="header">
                    <div id="dumonda-me-dialog-header">
                        {{$t('pages:detailQuestion.note.editNoteDialog.title', {answer: answerTitle})}}
                    </div>
                    <v-divider></v-divider>
                </div>
            </edit-note-dialog>
        </v-dialog>
        <v-snackbar top v-model="showError" color="error" :timeout="0">{{$t("common:error.unknown")}}
            <v-btn dark text @click="showError = false">{{$t("common:button.close")}}</v-btn>
        </v-snackbar>
    </div>
</template>

<script>
    import EditNoteDialog from './Note';

    export default {
        props: ['answerId', 'noteId', 'noteText', 'answerTitle'],
        data() {
            return {dialog: true, loading: false, showError: false}
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
                    this.showError = true;
                    this.loading = false;
                }
            }
        },
    }
</script>

<style lang="scss">

</style>
