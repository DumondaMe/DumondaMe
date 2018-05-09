<template>
    <div class="answer-note">
        <div class="note-title">
            <span class="user-name">{{note.creator.name}} </span>
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
</template>

<script>
    import CreateNoteDialog from '~/components/question/answer/note/CreateDialog';

    export default {
        props: ['note', 'answerId'],
        components: {CreateNoteDialog},
        data() {
            return {upVoteRunning: false}
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
                } finally {
                    this.upVoteRunning = false;
                }
            }
        },
    }
</script>

<style lang="scss">
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
</style>
