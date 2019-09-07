<template>
    <div>
        <div class="footer-up-vote-button">
            <up-vote-menu :answer-id="answerId" :is-logged-in-user="isLoggedInUser"
                          :is-admin="isAdmin" :up-voted-by-user="isUpVotedByUser"
                          :number-of-up-votes="numberOfUpVotes"
                          @up-voted="(answerId) => $emit('up-voted', answerId)"
                          @down-voted="(answerId) => $emit('down-voted', answerId)"
                          @up-vote-menu-closed="(data) => $emit('up-vote-menu-closed', data)">
                <div slot="icon">
                    <span class="description left-side" itemprop="upvoteCount">{{numberOfUpVotes}}</span>
                    <v-tooltip bottom v-if="!isUpVotedByUser || isAdmin">
                        <template v-slot:activator="{ on }">
                            <v-btn v-on="on" small fab color="not-up-voted"
                                   :disabled="isAdmin">
                                <v-icon size="20">mdi-thumb-up-outline</v-icon>
                            </v-btn>
                        </template>
                        <span>{{$t("common:feedCard.upVote.userHasNotUpVoted")}}</span>
                    </v-tooltip>
                    <v-tooltip bottom v-else>
                        <template v-slot:activator="{ on }">
                            <v-btn v-on="on" fab small color="up-voted" :disabled="isAdmin">
                                <v-icon size="20">mdi-thumb-up</v-icon>
                            </v-btn>
                        </template>
                        <span>{{$t("common:feedCard.upVote.userHasUpVoted")}}</span>
                    </v-tooltip>
                </div>
            </up-vote-menu>
        </div>
        <login-required-dialog v-if="showLoginRequired" @close-dialog="showLoginRequired = false">
        </login-required-dialog>
        <v-snackbar top v-model="showError" color="error" :timeout="0">{{$t("common:error.unknown")}}
            <v-btn dark text @click="showError = false">{{$t("common:button.close")}}</v-btn>
        </v-snackbar>
    </div>
</template>

<script>
    import UpVoteMenu from '~/components/feed/card/footer/menu/UpVote';
    import LoginRequiredDialog from '~/components/common/dialog/LoginRequired';

    export default {
        props: ['numberOfUpVotes', 'isUpVotedByUser', 'isLoggedInUser', 'isAdmin', 'answerId'],
        components: {UpVoteMenu, LoginRequiredDialog},
        data() {
            return {
                showLoginRequired: false, upVoteRunning: false, showError: false
            }
        }
    }
</script>

<style lang="scss">
    .card-footer-feed {
        .footer-up-vote-button {
            .not-up-voted.v-btn {
                background-color: #009688 !important;

                i.v-icon {
                    color: white;
                }
            }

            button.up-voted.v-btn {
                background-color: #607D8B !important;

                i.v-icon {
                    color: white;
                }
            }

            button {
                margin: 0;
            }

            .description.left-side {
                display: inline-block;
                vertical-align: top;
                line-height: 14px;
                height: 14px;
                font-size: 16px;
                font-weight: 500;
                color: $secondary-text;
                margin: 14px 8px 12px 0;
            }
        }
    }
</style>