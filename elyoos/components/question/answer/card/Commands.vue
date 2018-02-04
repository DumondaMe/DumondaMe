<template>
    <div>
        <v-layout row class="answer-commands">
            <div class="comment-icon">
                <v-icon>chat_bubble_outline</v-icon>
                <span class="comment-text">0 Kommentare</span>
            </div>
            <v-spacer></v-spacer>
            <div class="up-vote-button">
                <span class="up-votes">{{answer.upVotes}}</span>
                <v-btn icon outline :disabled="answer.isAdmin || upVoteRunning" @click="upVote()" class="up-vote"
                       :loading="upVoteRunning" v-if="!answer.hasVoted || answer.isAdmin ">
                    <v-icon>arrow_upward</v-icon>
                </v-btn>
                <v-btn icon outline :disabled="answer.isAdmin || upVoteRunning" @click="downVote()" class="down-vote"
                       :loading="upVoteRunning" v-if="answer.hasVoted && !answer.isAdmin">
                    <v-icon>arrow_downward</v-icon>
                </v-btn>
            </div>
        </v-layout>
        <login-required-dialog v-if="showLoginRequired" @close-dialog="showLoginRequired = false">
        </login-required-dialog>
    </div>
</template>

<script>
    import LoginRequiredDialog from '~/components/common/dialog/LoginRequired.vue';

    export default {
        props: ['answer'],
        components: {LoginRequiredDialog},
        data() {
            return {showLoginRequired: false, upVoteRunning: false}
        },
        computed: {
            isAuthenticated() {
                return this.$store.state.auth.userIsAuthenticated
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
            }
        }
    }
</script>

<style lang="scss">
    .answer-commands {
        margin-top: 6px;
        .comment-icon {
            padding-top: 2px;
            cursor: pointer;
            i.icon {
                color: $primary-color;
            }
            .comment-text {
                margin-left: 6px;
                font-size: 14px;
                font-weight: 500;
                color: $secondary-text;
            }
            :hover.comment-text {
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
            button.up-vote {
                margin: 0 4px 0 0;
                height: 28px;
                width: 28px;
                border-width: 2px;
                color: #009688;
                i.icon {
                    font-size: 18px;
                }
            }
            button.down-vote {
                margin: 0 4px 0 0;
                height: 28px;
                width: 28px;
                border-width: 2px;
                color: #FF5252;
                i.icon {
                    font-size: 18px;
                }
            }
        }
    }
</style>
