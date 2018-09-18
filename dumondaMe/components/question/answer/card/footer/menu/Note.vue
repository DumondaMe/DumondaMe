<template>
    <div class="answer-note">
        <div class="note-title">
            <span class="user-name" v-if="note.isAdmin" @click="$router.push({name: 'user'})">
                {{$t("common:you")}} </span>
            <span class="user-name" v-else @click="$router.push({name: 'user-userId-slug',
                     params: {userId: note.creator.userId, slug: note.creator.slug}})">
                {{note.creator.name}} </span>
            <span class="created">{{note.created | formatRelativeTimesAgo}}</span>
        </div>
        <div class="note-text" v-html="note.textHtml"></div>
        <div class="note-commands">
            <div class="note-command">
                <v-btn icon outline class="command" :disabled="note.isAdmin || upVoteRunning"
                       :loading="upVoteRunning" @click="upVoteNote(note.noteId)" v-if="!note.hasVoted">
                    <v-icon>mdi-thumb-up-outline</v-icon>
                </v-btn>
                <v-btn icon outline class="command" :disabled="upVoteRunning"
                       :loading="upVoteRunning" @click="downVoteNote(note.noteId)" v-else>
                    <v-icon>mdi-thumb-down-outline</v-icon>
                </v-btn>
                <span class="command-text">{{note.upVotes}}</span>
            </div>
            <div class="note-command" v-if="note.isAdmin">
                <v-btn icon outline class="command" @click="showEditNoteDialog = true">
                    <v-icon>mdi-pencil</v-icon>
                </v-btn>
            </div>
            <div class="note-command" v-if="note.isAdmin">
                <v-btn icon outline class="command" @click="showDeleteNoteDialog = true">
                    <v-icon>mdi-delete</v-icon>
                </v-btn>
            </div>
        </div>
        <edit-note-dialog v-if="showEditNoteDialog" @close-dialog="showEditNoteDialog = false"
                          @finish="showEditNoteDialog = false" :note-text="note.text" :note-id="note.noteId"
                          :answer-id="answerId" :answer-title="answerTitle">
        </edit-note-dialog>
        <delete-note-dialog v-if="showDeleteNoteDialog" @close-dialog="showDeleteNoteDialog = false"
                            @finish="showDeleteNoteDialog = false" :note-id="note.noteId" :answer-id="answerId"
                            :note-text="note.text">
        </delete-note-dialog>
        <v-snackbar top v-model="showError" color="error" :timeout="0">{{$t("common:error.unknown")}}
            <v-btn dark flat @click="showError = false">{{$t("common:button.close")}}</v-btn>
        </v-snackbar>
    </div>
</template>

<script>
    import EditNoteDialog from '~/components/question/answer/dialog/note/EditDialog';
    import DeleteNoteDialog from '~/components/question/answer/dialog/note/DeleteNoteDialog';

    export default {
        props: ['note', 'answerId', 'answerTitle'],
        components: {EditNoteDialog, DeleteNoteDialog},
        data() {
            return {upVoteRunning: false, showEditNoteDialog: false, showDeleteNoteDialog: false, showError: false}
        },
        methods: {
            async upVoteNote(noteId) {
                await this.sendingVoteCommand(noteId, 'question/upVoteNoteOfAnswer')
            },
            async downVoteNote(noteId) {
                await this.sendingVoteCommand(noteId, 'question/downVoteNoteOfAnswer')
            },
            async sendingVoteCommand(noteId, command) {
                try {
                    this.upVoteRunning = true;
                    await this.$store.dispatch(command, {answerId: this.answerId, noteId});
                } catch (error) {
                    this.showError = true;
                } finally {
                    this.upVoteRunning = false;
                }
            }
        },
    }
</script>

<style lang="scss">
    .answer-note {
        margin-top: 14px;
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
                    .v-btn__content {
                        height: 100%;
                        width: 100%;
                        i.v-icon {
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
</style>
