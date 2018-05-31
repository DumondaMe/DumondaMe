<template>
    <div>
        <v-layout row class="answer-footer">
            <div class="note-icon-container" v-if="answer.answerType !== 'Commitment'">
                <v-icon class="note-icon">mdi-note-outline</v-icon>
                <span class="note-text" @click="toggleNotes">
                    {{$t("pages:detailQuestion.note.numberOfNotes", {count: answer.numberOfNotes})}}</span>
            </div>
            <div class="region-icon-container" v-else>
                <v-icon class="region-icon">mdi-map-marker</v-icon>
                <span v-for="region in answer.regions" class="region">{{$t("regions:" + region)}}</span>
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
        <notes :answer="answer" :answer-title="getAnswerTitle" v-if="showNotes">
        </notes>
        <login-required-dialog v-if="showLoginRequired" @close-dialog="showLoginRequired = false">
        </login-required-dialog>
        <create-note-dialog v-if="showCreateNoteDialog" @close-dialog="showCreateNoteDialog = false"
                            @finish="noteAdded"
                            :answer-id="answer.answerId" :answer-title="getAnswerTitle">
        </create-note-dialog>
    </div>
</template>

<script>
    import LoginRequiredDialog from '~/components/common/dialog/LoginRequired';
    import CreateNoteDialog from '~/components/question/answer/note/CreateDialog';
    import Notes from './Notes';

    export default {
        props: ['answer'],
        components: {LoginRequiredDialog, CreateNoteDialog, Notes},
        data() {
            return {
                showLoginRequired: false, showCreateNoteDialog: false, showNotes: false, upVoteRunning: false,
                sortNotes: null
            }
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
            toggleNotes() {
                if (!this.showNotes) {
                    if (this.$store.state.auth.userIsAuthenticated && this.answer.numberOfNotes === 0) {
                        this.showCreateNoteDialog = true;
                    } else if (this.answer.numberOfNotes === 0) {
                        this.showLoginRequired = true;
                    } else {
                        this.showNotes = true;
                    }
                } else {
                    this.showNotes = false;
                }
            },
            noteAdded() {
                this.showCreateNoteDialog = false;
                this.showNotes = true;
            }
        }
    }
</script>

<style lang="scss">
    .answer-footer {
        margin-top: 6px;
        .note-icon-container {
            padding-top: 2px;
            i.icon {
                font-size: 20px;
                color: $primary-color;
            }
            .note-icon.icon {
                margin-left: -2px;
            }
            .note-text {
                cursor: pointer;
                margin-left: 2px;
                font-size: 14px;
                color: $secondary-text;
            }
            :hover.note-text {
                text-decoration: underline;
            }
        }
        .region-icon-container {
            height: 30px;
            .region-icon {
                margin-left: -4px;
                font-size: 20px;
                line-height: 30px;
                margin-right: 2px;
            }
            .region {
                margin-left: 2px;
                line-height: 30px;
                height: 30px;
                font-size: 14px;
                color: $secondary-text;
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
