<template>
    <div class="card-footer-feed">
        <div class="footer-icon">
            <user-menu :menu-title="creatorTitle" :user-image="creator.userImagePreview"
                       :user-name="creator.name" :user-id="creator.userId" :user-slug="creator.slug"
                       :is-trust-user="creator.isTrustUser" :is-logged-in-user="creator.isLoggedInUser">
                <div class="user-icon creator-icon" slot="icon">
                    <img :src="creator.userImage">
                </div>
            </user-menu>
        </div>
        <div class="footer-icon">
            <v-tooltip bottom>
                <div slot="activator">
                    <v-icon medium class="action-icon">
                        mdi-map-marker
                    </v-icon>
                    <span class="footer-description number">{{regions.length}}</span>
                </div>
                <span>{{$t("common:feedCard.region.tooltipDescription")}}</span>
            </v-tooltip>
        </div>
        <v-spacer></v-spacer>
        <div class="footer-up-vote-button">
            <span class="description left-side">{{numberOfUpVotes}}</span>
            <v-tooltip bottom v-if="!hasVoted || isAdmin">
                <v-btn slot="activator" small fab color="not-up-voted"
                       :disabled="isAdmin || upVoteRunning" @click="upVote()">
                    <v-icon>mdi-thumb-up-outline</v-icon>
                </v-btn>
                <span>{{$t("common:feedCard.upVote.descriptionUserHasNotUpVoted")}}</span>
            </v-tooltip>
            <v-tooltip bottom v-else>
                <v-btn slot="activator" fab small color="secondary" :disabled="isAdmin || upVoteRunning"
                       @click="downVote()">
                    <v-icon>mdi-thumb-up</v-icon>
                </v-btn>
                <span>{{$t("common:feedCard.upVote.descriptionUserHasUpVoted")}}</span>
            </v-tooltip>
        </div>
    </div>
</template>

<script>
    import UserMenu from '~/components/feed/card/footer/menu/User';

    export default {
        props: ['creator', 'regions', 'numberOfUpVotes', 'hasVoted', 'isAdmin', 'answerId'],
        components: {UserMenu},
        data() {
            return {
                showLoginRequired: false, showCreateNoteDialog: false, showNotes: false, upVoteRunning: false,
                sortNotes: null, showError: false
            }
        },
        computed: {
            creatorTitle() {
                if (this.creator && this.creator.isLoggedInUser) {
                    return this.$t("pages:feeds.menu.creatorAnswer.titleIsLoggedInUser");
                }
                return this.$t("pages:feeds.menu.creatorAnswer.title");
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
    .feed-card {
        .card-footer-feed {
            .footer-up-vote-button {
                .not-up-voted {
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
                    font-weight: 700;
                    color: $secondary-text;
                    margin-right: 8px;
                }
            }
        }
    }
</style>