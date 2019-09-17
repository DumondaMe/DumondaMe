<template>
    <div>
        <v-menu v-model="menu" :close-on-content-click="false" :nudge-width="280" offset-y
                :close-on-click="closeOnClickOutside">
            <template v-slot:activator="{ on }">
                <div v-on="on">
                    <slot name="icon"></slot>
                </div>
            </template>
            <v-card class="ely-menu-container" v-if="menu">
                <div class="menu-title">{{$t('common:feedCard.note.menuDescription')}}
                    <span class="primary-title">{{title}}</span>
                </div>
                <div class="menu-note-answer-content menu-content">
                    <div class="note-description" v-if="numberOfNotes === 0">
                        {{$t('common:feedCard.note.noAnswerNote')}}
                    </div>
                    <div v-else>
                        <div class="notes-commands">
                            <div class="sort-button-container" :class="{'sort-deactivated': notes && notes.length < 3}">
                                <v-btn icon class="sort-button" @click="toggleSort">
                                    <v-icon>mdi-sort-descending</v-icon>
                                </v-btn>
                                <span class="sort-text" @click="toggleSort">{{$t('pages:detailQuestion.note.sort.' + noteSort)}}</span>
                            </div>
                        </div>
                        <div class="note-answer-container">
                            <note v-for="note in notes" :note="note" :answer-id="answerId" :answer-title="title"
                                  :key="note.noteId"
                                  @edit-note="editNote" @delete-note="deleteNote">
                            </note>
                        </div>
                    </div>
                </div>
                <v-divider></v-divider>
                <div class="menu-commands">
                    <v-spacer></v-spacer>
                    <v-btn text color="primary" @click="menu = false">{{$t('common:button.close')}}</v-btn>
                    <v-btn color="primary" @click="openCreateNoteDialog()">
                        {{$t('common:button.createNote')}}
                    </v-btn>
                </div>
            </v-card>
        </v-menu>
        <login-required-dialog v-if="showLoginRequired" @close-dialog="showLoginRequired = false">
        </login-required-dialog>
        <create-note-dialog @close-dialog="showCreateNoteDialog = false; closeOnClickOutside = true"
                            :answer-id="answerId" :answer-title="title"
                            @finish="showCreateNoteDialog = false; closeOnClickOutside = true"
                            v-if="showCreateNoteDialog">
        </create-note-dialog>
        <edit-note-dialog v-if="showEditNoteDialog"
                          @close-dialog="showEditNoteDialog = false; closeOnClickOutside = true"
                          @finish="showEditNoteDialog = false" :note-text="actualNote.text" :note-id="actualNote.noteId"
                          :answer-id="answerId" :answer-title="title">
        </edit-note-dialog>
        <delete-note-dialog v-if="showDeleteNoteDialog"
                            @close-dialog="showDeleteNoteDialog = false; closeOnClickOutside = true"
                            @finish="showDeleteNoteDialog = false" :note-id="actualNote.noteId" :answer-id="answerId"
                            :note-text="actualNote.text">
        </delete-note-dialog>
        <v-snackbar top v-model="showError" color="error" :timeout="0">{{$t("common:error.unknown")}}
            <v-btn dark text @click="showError = false">{{$t("common:button.close")}}</v-btn>
        </v-snackbar>
    </div>
</template>

<script>
    import CreateNoteDialog from '~/components/question/answer/dialog/note/CreateDialog';
    import LoginRequiredDialog from '~/components/common/dialog/LoginRequired';
    import EditNoteDialog from '~/components/question/answer/dialog/note/EditDialog';
    import DeleteNoteDialog from '~/components/question/answer/dialog/note/DeleteNoteDialog';
    import Note from './Note';

    export default {
        props: ['title', 'numberOfNotes', 'answerId', 'notes'],
        data() {
            return {
                menu: false, showCreateNoteDialog: false, showEditNoteDialog: false, showDeleteNoteDialog: false,
                loading: false, showError: false, closeOnClickOutside: true, showLoginRequired: false, actualNote: {}
            };
        },
        computed: {
            noteSort() {
                return this.$store.state.question.sortNotes;
            }
        },
        components: {CreateNoteDialog, EditNoteDialog, DeleteNoteDialog, LoginRequiredDialog, Note},
        methods: {
            async toggleSort() {
                if (this.notes.length > 2) {
                    try {
                        this.$store.commit('question/TOGGLE_ANSWER_NOTE_SORT');
                        await this.$store.dispatch('question/loadAnswerNote', this.answerId);
                    } catch (error) {
                        this.showError = true;
                    }
                }
            },
            openCreateNoteDialog() {
                if (this.$store.state.auth.userIsAuthenticated) {
                    this.showCreateNoteDialog = true;
                    this.closeOnClickOutside = false
                } else {
                    this.showLoginRequired = true;
                }
            },
            editNote(note) {
                this.actualNote = note;
                this.showEditNoteDialog = true;
                this.closeOnClickOutside = false;
            },
            deleteNote(note) {
                this.actualNote = note;
                this.showDeleteNoteDialog = true;
                this.closeOnClickOutside = false;
            }
        },
        watch: {
            async menu(isOpen) {
                if (this.numberOfNotes > 0 && isOpen) {
                    try {
                        this.loading = true;
                        await this.$store.dispatch('question/loadAnswerNote', this.answerId);
                    } catch (error) {
                        this.showError = true;
                    } finally {
                        this.loading = false;
                    }
                }
            }
        }
    }
</script>

<style lang="scss">
    .ely-menu-container {
        .menu-note-answer-content {

            .note-description {
                max-width: 350px;
            }

            .notes-commands {
                margin-bottom: 18px;

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
    }
</style>