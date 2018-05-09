<template>
    <div class="answer-notes-container">
        <div class="notes-commands">
            <div class="sort-button-container" :class="{'sort-deactivated': answer.notes.length < 2}">
                <v-btn icon class="sort-button" @click="">
                    <v-icon>mdi-sort-descending</v-icon>
                </v-btn>
                <span class="sort-text">Neuste</span>
            </div>
            <v-btn icon class="add-note-button" @click="showCreateNoteDialog = true">
                <v-icon>mdi-note-plus</v-icon>
            </v-btn>
        </div>
        <note :note="note" :answer-id="answer.answerId" :answer-title="answerTitle"
              v-for="note in answer.notes" :key="note.noteId"></note>
        <create-note-dialog v-if="showCreateNoteDialog" @close-dialog="showCreateNoteDialog = false"
                            @finish="showCreateNoteDialog = false"
                            :answer-id="answer.answerId" :answer-title="answerTitle">
        </create-note-dialog>
    </div>
</template>

<script>
    import CreateNoteDialog from '~/components/question/answer/note/CreateDialog';
    import Note from './Note';

    export default {
        props: ['answer', 'answerTitle'],
        components: {CreateNoteDialog, Note},
        data() {
            return {showCreateNoteDialog: false}
        },
        async created() {
            if (this.answer.notes.length === 0) {
                try {
                    await this.$store.dispatch('question/loadAnswerNote', this.answer.answerId);
                }
                catch (error) {
                }
            }
        }
    }
</script>

<style lang="scss">
    .answer-notes-container {
        margin-top: 22px;
        .notes-commands {
            margin-bottom: 18px;
            .add-note-button {
                color: $primary-color;
                padding: 0;
                margin: 0;
                height: 24px;
                width: 24px;
            }
            .sort-button-container {
                display: inline-block;
                margin-right: 18px;
                .sort-button {
                    color: $primary-color;
                    padding: 0;
                    margin: 0 0 0 -2px;
                    height: 24px;
                    width: 24px;
                }
                .sort-text {
                    cursor: pointer;
                    margin-left: 6px;
                    line-height: 24px;
                    font-size: 14px;
                    vertical-align: middle;
                }
                :hover.sort-text {
                    text-decoration: underline;
                }
            }
            .sort-button-container.sort-deactivated {
                .sort-button {
                    cursor: not-allowed;
                    color: $secondary-text;
                }
                .sort-text {
                    cursor: not-allowed;
                    color: $secondary-text;
                }
                :hover.sort-text {
                    text-decoration: none;
                }
            }
        }
    }
</style>
