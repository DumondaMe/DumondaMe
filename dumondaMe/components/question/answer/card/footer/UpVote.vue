<template>
    <div>
        <div class="footer-up-vote-button">
            <up-vote-menu :answer-id="answerId" :is-logged-in-user="true"
                          :is-admin="isAdmin" :up-voted-by-user="isUpVotedByUser"
                          :number-of-up-votes="numberOfUpVotes"
                          @up-voted="upVote"
                          @down-voted="downVote"
                          @up-vote-menu-closed="(data) => $emit('up-vote-menu-closed', data)">
                <div slot="icon">
                    <span class="description left-side">{{numberOfUpVotes}}</span>
                    <v-tooltip bottom v-if="!isUpVotedByUser || isAdmin">
                        <v-btn slot="activator" small fab color="not-up-voted"
                               :disabled="isAdmin">
                            <v-icon>mdi-thumb-up-outline</v-icon>
                        </v-btn>
                        <span>{{$t("common:feedCard.upVote.userHasNotUpVoted")}}</span>
                    </v-tooltip>
                    <v-tooltip bottom v-else>
                        <v-btn slot="activator" fab small color="up-voted" :disabled="isAdmin">
                            <v-icon>mdi-thumb-up</v-icon>
                        </v-btn>
                        <span>{{$t("common:feedCard.upVote.userHasUpVoted")}}</span>
                    </v-tooltip>
                </div>
            </up-vote-menu>
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
    import UpVoteMenu from '~/components/feed/card/footer/menu/UpVote';
    import LoginRequiredDialog from '~/components/common/dialog/LoginRequired';

    export default {
        props: ['numberOfUpVotes', 'isUpVotedByUser', 'isAdmin', 'answerId'],
        components: {UserMenu, UpVoteMenu, LoginRequiredDialog},
        data() {
            return {
                showLoginRequired: false, upVoteRunning: false, showError: false
            }
        },
        methods: {
            upVote() {
                this.$store.commit('question/UP_VOTE_ANSWER', this.answerId)
            },
            downVote() {
                this.$store.commit('question/DOWN_VOTE_ANSWER', this.answerId)
            }
        }
    }
</script>

<style lang="scss">
    .card-footer-feed {
        .footer-up-vote-button {
            .not-up-voted.v-btn {
                background-color: #009688;
                i.v-icon {
                    color: white;
                }
            }
            .up-voted.v-btn {
                background-color: #607D8B;
                i.v-icon {
                    color: white;
                }
            }
            button {
                margin: 0;
            }
            .description.left-side {
                font-size: 16px;
                font-weight: 500;
                color: $secondary-text;
                margin-right: 8px;
            }
        }
    }
</style>