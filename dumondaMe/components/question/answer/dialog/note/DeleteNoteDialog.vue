<template>
    <v-layout row justify-center>
        <v-dialog v-model="dialog" scrollable persistent max-width="300px" :fullscreen="$vuetify.breakpoint.xsOnly">
            <v-card id="dialog-delete-note">
                <v-card-title>
                    {{$t("pages:detailQuestion.note.deleteNoteDialog.title")}}
                </v-card-title>
                <v-divider></v-divider>
                <v-card-text id="dialog-delete-question-content">
                    <p>{{$t("pages:detailQuestion.note.deleteNoteDialog.description", {note: noteText})}}</p>
                </v-card-text>
                <v-divider></v-divider>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="primary" flat @click.native="$emit('close-dialog')" :disabled="running">
                        {{$t("common:button.abort")}}
                    </v-btn>
                    <v-btn color="primary" @click.native="deleteNote()"
                           :loading="running" :disabled="running">
                        {{$t("pages:detailQuestion.note.deleteNoteDialog.confirmButton")}}
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <v-snackbar top v-model="showError" color="error" :timeout="0">{{$t("common:error.unknown")}}
            <v-btn dark flat @click="showError = false">{{$t("common:button.close")}}</v-btn>
        </v-snackbar>
    </v-layout>
</template>

<script>
    export default {
        props: ['noteId', 'answerId', 'noteText'],
        data() {
            return {dialog: true, running: false, showError: false}
        },
        computed: {
            question() {
                return this.$store.state.question.question.question;
            }
        },
        methods: {
            async deleteNote() {
                try {
                    this.running = true;
                    await this.$store.dispatch('question/deleteNoteOfAnswer',
                        {noteId: this.noteId, answerId: this.answerId});
                    this.$emit('finish');
                } catch (error) {
                    this.showError = true;
                    this.running = false;
                }
            }
        },
    }
</script>

<style lang="scss">

</style>
