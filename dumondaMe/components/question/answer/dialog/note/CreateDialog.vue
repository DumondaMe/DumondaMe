<template>
    <div>
        <v-dialog v-model="dialog" scrollable persistent max-width="650px" :fullscreen="$vuetify.breakpoint.xsOnly">
            <create-note-dialog @close-dialog="$emit('close-dialog')" :action-button-text="$t('common:button.create')"
                                @finish="createNote" :loading="loading" init-note-text="">
                <div slot="header">
                    <div id="dumonda-me-dialog-header">
                        {{$t('pages:detailQuestion.note.createNoteDialog.title', {answer: answerTitle})}}
                    </div>
                    <v-divider></v-divider>
                </div>
            </create-note-dialog>
        </v-dialog>
        <v-snackbar top v-model="showError" color="error" :timeout="0">{{$t("common:error.unknown")}}
            <v-btn dark text @click="showError = false">{{$t("common:button.close")}}</v-btn>
        </v-snackbar>
    </div>
</template>

<script>
    import CreateNoteDialog from './Note';

    export default {
        props: ['answerId', 'answerTitle'],
        data() {
            return {dialog: true, loading: false, showError: false}
        },
        components: {CreateNoteDialog},
        methods: {
            async createNote(text) {
                try {
                    this.loading = true;
                    await this.$store.dispatch('question/createAnswerNote', {answerId: this.answerId, text});
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
