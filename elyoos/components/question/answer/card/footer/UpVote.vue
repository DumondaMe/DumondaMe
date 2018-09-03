<template>
    <div>
        <div class="footer-up-vote-button">
            <span class="description left-side">{{numberOfUpVotes}}</span>
            <v-tooltip bottom v-if="!hasVoted || isAdmin">
                <v-btn slot="activator" small fab color="not-up-voted"
                       :disabled="isAdmin || upVoteRunning" @click="upVote()">
                    <v-icon>mdi-thumb-up-outline</v-icon>
                </v-btn>
                <span>{{$t("common:feedCard.upVote.userHasNotUpVoted")}}</span>
            </v-tooltip>
            <v-tooltip bottom v-else>
                <v-btn slot="activator" fab small color="up-voted" :disabled="isAdmin || upVoteRunning"
                       @click="downVote()">
                    <v-icon>mdi-thumb-up</v-icon>
                </v-btn>
                <span>{{$t("common:feedCard.upVote.userHasUpVoted")}}</span>
            </v-tooltip>
        </div>
        <login-required-dialog v-if="showLoginRequired" @close-dialog="showLoginRequired = false">
        </login-required-dialog>
        <v-snackbar top v-model="showError" color="error" :timeout="0">{{$t("common:error.unknown")}}
            <v-btn dark flat @click="showError = false">{{$t("common:button.close")}}</v-btn>
        </v-snackbar>
    </div>
</template>

<script>
    import UserMenu from '~/components/feed/card/footer/menu/User';
    import LoginRequiredDialog from '~/components/common/dialog/LoginRequired';

    export default {
        props: ['numberOfUpVotes', 'hasVoted', 'isAdmin', 'answerId'],
        components: {UserMenu, LoginRequiredDialog},
        data() {
            return {
                showLoginRequired: false, upVoteRunning: false, showError: false
            }
        },
        methods: {
            async voteCommand(command) {
                if (this.$store.state.auth.userIsAuthenticated) {
                    try {
                        this.upVoteRunning = true;
                        await this.$store.dispatch(command, this.answerId);
                    } catch (error) {
                        this.showError = true;
                    } finally {
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
    .feed-card {
        .card-footer-feed {
            .footer-up-vote-button {
                .not-up-voted {
                    background-color: #009688;
                    i.v-icon {
                        color: white;
                    }
                }
                .up-voted {
                    background-color: #607D8B;
                    i.v-icon {
                        color: white;
                    }
                }
                button {
                    margin: 0;
                }
                .description.left-side {
                    font-size: 14px;
                    font-weight: 500;
                    color: $secondary-text;
                    margin-right: 8px;
                }
            }
        }
    }
</style>