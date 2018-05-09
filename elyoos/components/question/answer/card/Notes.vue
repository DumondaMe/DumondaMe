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
        <div class="answer-note" v-for="note in answer.notes" :key="note.noteId">
            <div class="note-title">
                <span class="user-name">{{note.creator.name}} </span>
                <span class="created">{{note.created | formatRelativeTimesAgo}}</span>
            </div>
            <div class="note-text" v-html="note.textHtml"></div>
            <div class="note-commands">
                <div class="note-command">
                    <v-btn icon outline class="command" :disabled="note.isAdmin">
                        <v-icon>mdi-thumb-up-outline</v-icon>
                    </v-btn>
                    <span class="command-text">{{note.upVotes}}</span>
                </div>
                <div class="note-command" v-if="note.isAdmin">
                    <v-btn icon outline class="command">
                        <v-icon>mdi-pencil</v-icon>
                    </v-btn>
                </div>
                <div class="note-command" v-if="note.isAdmin">
                    <v-btn icon outline class="command">
                        <v-icon>mdi-delete</v-icon>
                    </v-btn>
                </div>
            </div>
        </div>
        <create-note-dialog v-if="showCreateNoteDialog" @close-dialog="showCreateNoteDialog = false"
                            @finish="showCreateNoteDialog = false"
                            :answer-id="answer.answerId" :answer-title="answerTitle">
        </create-note-dialog>
    </div>
</template>

<script>
    import CreateNoteDialog from '~/components/question/answer/note/CreateDialog';

    export default {
        props: ['answer', 'answerTitle'],
        components: {CreateNoteDialog},
        data() {
            return {showCreateNoteDialog: false}
        },
        async mounted() {
            if (this.answer.notes.length === 0) {
                try {
                    this.$store.dispatch('question/loadAnswerNote', this.answer.answerId);
                }
                catch (error) {

                }
            }
        },
        methods: {
            addNote() {
                this.showCreateNoteDialog = true;
            }
        },
    }
</script>

<style lang="scss">
    .answer-notes-container {
        margin-top: 22px;
        .notes-commands {
            margin-bottom: 14px;
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
        .answer-note {
            margin-top: 8px;
            font-size: 14px;
            .note-title {
                .user-name {
                    cursor: pointer;
                    color: $primary-text;
                }
                :hover.user-name {
                    text-decoration: underline;
                }
                .created {
                    font-size: 12px;
                    color: $secondary-text;
                }
            }
            .note-text {
                font-weight: 300;
            }
            .note-commands {
                margin-top: 2px;
                .note-command {
                    display: inline-block;
                    margin-right: 2px;
                    .command {
                        color: $primary-color;
                        margin: 0 4px 0 0;
                        display: inline-block;
                        height: 28px;
                        width: 28px;
                        border-width: 1px;
                        font-size: 14px;
                        .btn__content {
                            height: 100%;
                            width: 100%;
                            i.icon {
                                color: $primary-color;
                                font-size: 16px;
                                font-weight: 400;
                            }
                        }
                    }
                    .command-text {
                        margin-left: 2px;
                        margin-right: 12px;
                        line-height: 24px;
                        vertical-align: middle;
                        font-weight: 500;
                        color: $secondary-text;
                    }
                }
            }
        }
    }
</style>
