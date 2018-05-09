<template>
    <v-layout row justify-center>
        <v-dialog v-model="dialog" scrollable persistent max-width="650px">
            <create-note-dialog @close-dialog="$emit('close-dialog')" :action-button-text="$t('common:button.create')"
                                @finish="createNote" :loading="loading" init-note-text="">
                <div slot="header">
                    <div id="elyoos-dialog-header">
                        {{$t('pages:detailQuestion.note.createNoteDialog.title', {answer: answerTitle})}}
                    </div>
                    <v-divider></v-divider>
                </div>
            </create-note-dialog>
        </v-dialog>
    </v-layout>
</template>

<script>
    import CreateNoteDialog from './Note';

    export default {
        props: ['answerId', 'answerTitle'],
        data() {
            return {dialog: true, loading: false}
        },
        components: {CreateNoteDialog},
        methods: {
            async createNote(text) {
                try {
                    this.loading = true;
                    await this.$store.dispatch('question/createAnswerNote', {answerId: this.answerId, text});
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
