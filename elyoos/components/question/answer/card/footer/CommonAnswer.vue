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
                        mdi-message-reply-text
                    </v-icon>
                    <span class="footer-description number">{{numberOfNotes}}</span>
                </div>
                <span>{{$t("common:feedCard.note.tooltipDescription")}}</span>
            </v-tooltip>
        </div>
        <v-spacer></v-spacer>
        <up-vote-button :number-of-up-votes="numberOfUpVotes" :has-voted="hasVoted"
                        :is-admin="isAdmin" :answer-id="answerId">
        </up-vote-button>
    </div>
</template>

<script>
    import UserMenu from '~/components/feed/card/footer/menu/User';
    import UpVoteButton from './UpVote';

    export default {
        props: ['creator', 'numberOfNotes', 'numberOfUpVotes', 'hasVoted', 'isAdmin', 'answerId'],
        components: {UserMenu, UpVoteButton},
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

</style>