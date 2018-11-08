<template>
    <div>
        <v-menu v-model="menu" :close-on-content-click="false" :nudge-width="280" offset-y
                :close-on-click="closeOnClickOutside">
            <slot name="icon" slot="activator"></slot>
            <v-card class="ely-menu-container">
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
                                  :key="note.noteId"></note>
                        </div>
                    </div>
                </div>
                <v-divider></v-divider>
                <div class="menu-commands">
                    <v-spacer></v-spacer>
                    <v-btn flat color="primary" @click="menu = false">{{$t('common:button.close')}}</v-btn>
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
        <v-snackbar top v-model="showError" color="error" :timeout="0">{{$t("common:error.unknown")}}
            <v-btn dark flat @click="showError = false">{{$t("common:button.close")}}</v-btn>
        </v-snackbar>
    </div>
</template>

<script>
    import CreateNoteDialog from '~/components/question/answer/dialog/note/CreateDialog';
    import LoginRequiredDialog from '~/components/common/dialog/LoginRequired';
    import Note from './Note';

    export default {
        props: ['title', 'numberOfNotes', 'answerId', 'notes'],
        data() {
            return {
                menu: false, showCreateNoteDialog: false, loading: false, showError: false,
                closeOnClickOutside: true, showLoginRequired: false
            };
        },
        computed: {
            noteSort() {
                return this.$store.state.question.sortNotes;
            }
        },
        components: {CreateNoteDialog, LoginRequiredDialog, Note},
        methods: {
            async toggleSort() {
                if (this.notes.length > 2) {
                    try {
                        this.$store.commit('question/TOGGLE_ANSWER_NOTE_SORT');
                        await this.$store.dispatch('question/loadAnswerNote', this.answerId);
                    }
                    catch (error) {
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
            }
        },
        watch: {
            async menu(isOpen) {
                if (this.numberOfNotes > 0 && isOpen) {
                    try {
                        this.loading = true;
                        await this.$store.dispatch('question/loadAnswerNote', this.answerId);
                    }
                    catch (error) {
                        this.showError = true;
                    }
                    finally {
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