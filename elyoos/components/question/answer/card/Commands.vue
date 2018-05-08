<template>
    <div>
        <v-layout row class="answer-commands">
            <div class="note-icon" v-if="answer.answerType !== 'Commitment'">
                <v-icon>mdi-note-outline</v-icon>
                <span class="note-text" @click="showNote">
                    {{$t("pages:detailQuestion.note.numberOfNotes", {count: answer.numberOfNotes})}}</span>
            </div>
            <v-spacer></v-spacer>
            <div class="up-vote-button">
                <span class="up-votes" itemprop="upvoteCount">{{answer.upVotes}}</span>
                <v-btn icon outline :disabled="answer.isAdmin || upVoteRunning" @click="upVote()" class="up-vote"
                       :loading="upVoteRunning" v-if="!answer.hasVoted || answer.isAdmin ">
                    <v-icon>mdi-arrow-up</v-icon>
                </v-btn>
                <v-btn icon outline :disabled="answer.isAdmin || upVoteRunning" @click="downVote()" class="down-vote"
                       :loading="upVoteRunning" v-if="answer.hasVoted && !answer.isAdmin">
                    <v-icon>mdi-arrow-down</v-icon>
                </v-btn>
            </div>
        </v-layout>
        <login-required-dialog v-if="showLoginRequired" @close-dialog="showLoginRequired = false">
        </login-required-dialog>
        <create-note-dialog v-if="showCreateNoteDialog" @close-dialog="showCreateNoteDialog = false"
                            @finish="noteAdded"
                            :answer-id="answer.answerId" :answer-title="getAnswerTitle">
        </create-note-dialog>
    </div>
</template>

<script>
    import LoginRequiredDialog from '~/components/common/dialog/LoginRequired.vue';
    import CreateNoteDialog from '~/components/question/answer/note/CreateDialog.vue';

    export default {
        props: ['answer'],
        components: {LoginRequiredDialog, CreateNoteDialog},
        data() {
            return {showLoginRequired: false, showCreateNoteDialog: false, upVoteRunning: false}
        },
        computed: {
            getAnswerTitle() {
                if (this.answer.answerType === 'Text') {
                    if (this.answer.answer.length > 40) {
                        return this.answer.answer.slice(0, 40) + '...';
                    }
                    return this.answer.answer;
                }
                return this.answer.title;
            }
        },
        methods: {
            async voteCommand(command) {
                if (this.$store.state.auth.userIsAuthenticated) {
                    try {
                        this.upVoteRunning = true;
                        await this.$store.dispatch(command, this.answer.answerId);
                        this.upVoteRunning = false;
                    } catch (error) {
                        this.upVoteRunning = false;
                    }
                } else {
                    this.showLoginRequired = true;
                }
            },
            async upVote() {
                this.voteCommand('question/upVoteAnswer');
            },
            async downVote() {
                this.voteCommand('question/downVoteAnswer');
            },
            showNote() {
                if (this.$store.state.auth.userIsAuthenticated && this.answer.numberOfNotes === 0) {
                    this.showCreateNoteDialog = true;
                } else if (this.answer.numberOfNotes === 0) {
                    this.showLoginRequired = true;
                } else {

                }
            },
            noteAdded() {
                this.showCreateNoteDialog = false;
            }
        }
    }
</script>

<style lang="scss">
    .answer-commands {
        margin-top: 6px;
        .note-icon {
            padding-top: 2px;
            cursor: pointer;
            i.icon {
                color: $primary-color;
            }
            .note-text {
                margin-left: 6px;
                font-size: 14px;
                font-weight: 500;
                color: $secondary-text;
            }
            :hover.note-text {
                text-decoration: underline;
            }
        }
        .up-vote-button {
            .up-votes {
                margin-right: 6px;
                position: relative;
                top: 2px;
                font-size: 16px;
                font-weight: 500;
                color: $secondary-text;
            }
            button {
                margin: 0 4px 0 0;
                display: inline-block;
                height: 30px;
                width: 30px;
                border-width: 2px;
                font-size: 14px;
                .btn__content {
                    height: 100%;
                    width: 100%;
                    i.icon {
                        font-size: 20px;
                        font-weight: 400;
                    }
                }
            }
            button.up-vote {
                color: #009688;
            }
            button.down-vote {
                color: #FF5252;
            }
        }
    }
</style>
