<template>
    <div class="card-footer-feed">
        <div class="footer-icon" v-if="creator && cardType === 'CommitmentAnswer'">
            <user-menu :menu-title="creatorTitle" :user-image="creator.userImagePreview"
                       :user-name="creator.name" :user-id="creator.userId" :user-slug="creator.slug"
                       :is-trust-user="creator.isTrustUser" :is-logged-in-user="creator.isLoggedInUser">
                <div class="user-icon creator-icon" slot="icon">
                    <img :src="creator.userImage">
                </div>
            </user-menu>
        </div>
        <div class="separator-icon" v-if="creator && cardType === 'CommitmentAnswer'">
            <v-icon medium>
                mdi-menu-right
            </v-icon>
        </div>
        <div class="footer-icon" v-if="user">
            <user-menu :menu-title="userTitle" :user-image="user.userImagePreview"
                       :user-name="user.name" :user-id="user.userId" :user-slug="user.slug"
                       :is-trust-user="user.isTrustUser" :is-logged-in-user="user.isLoggedInUser">
                <div class="user-icon creator-icon" slot="icon">
                    <img :src="user.userImage">
                </div>
            </user-menu>
        </div>
        <div class="footer-icon" v-if="user">
            <div v-if="cardType === 'Commitment'">
                <watches-menu :user-id="user.userId" :user-name="user.name" :watched-id="commitmentId"
                              watched-id-name="commitmentId" :user-slug="user.slug"
                              :is-logged-in-user="user.isLoggedInUser" :is-watching-action="action === 'watch'"
                              :is-admin="isAdmin"
                              :watched-by-user="isWatchedByUser" :number-of-watches="numberOfWatches"
                              menu-translation="watchesCommitment" api-get-user-command="commitment/watches"
                              api-watch="user/commitment/watch"
                              @add-watch="(id) => $emit('add-watch', id)"
                              @remove-watch="(id) => $emit('remove-watch', id)"
                              @watch-menu-closed="(data) => $emit('watch-menu-closed', data)">
                    <div slot="icon">
                        <v-icon medium class="action-icon">mdi-star</v-icon>
                        <span class="footer-description number">{{numberOfWatches}}</span>
                    </div>
                </watches-menu>
            </div>

            <v-icon medium v-if="action === 'created' && cardType === 'CommitmentAnswer'"
                    class="action-icon">
                mdi-comment-plus
            </v-icon>

            <up-vote-menu v-if="action === 'upVote'" :user-name="user.name" :user-id="user.userId" :answer-id="answerId"
                          :user-slug="user.slug" :is-logged-in-user="user.isLoggedInUser"
                          :is-admin="creator.isLoggedInUser" :up-voted-by-user="isUpVotedByUser"
                          :number-of-up-votes="numberOfUpVotes"
                          @up-voted="(answerId) => $emit('up-voted', answerId)"
                          @down-voted="(answerId) => $emit('down-voted', answerId)"
                          @up-vote-menu-closed="(data) => $emit('up-vote-menu-closed', data)">
                <div slot="icon">
                    <v-icon medium class="action-icon">mdi-thumb-up</v-icon>
                    <span class="footer-description number">{{numberOfUpVotes}}</span>
                </div>
            </up-vote-menu>
        </div>
        <div class="footer-icon">
            <v-icon medium class="action-icon">mdi-map-marker</v-icon>
            <span class="footer-description number">{{regions.length}}</span>
        </div>
    </div>
</template>

<script>
    import UserMenu from './menu/User';
    import UpVoteMenu from './menu/UpVote';
    import WatchesMenu from './menu/Watches'

    export default {
        props: ['user', 'creator', 'created', 'action', 'regions', 'cardType', 'numberOfUpVotes', 'isUpVotedByUser',
            'numberOfWatches', 'isWatchedByUser', 'isAdmin', 'answerId', 'commitmentId'],
        components: {UserMenu, WatchesMenu, UpVoteMenu},
        computed: {
            userTitle() {
                if (this.action === 'created' && this.cardType === 'CommitmentAnswer') {
                    return this.$t("pages:feeds.menu.creatorAnswer.title");
                } else if (this.action === 'created' && this.cardType === 'Commitment') {
                    return this.$t("pages:feeds.menu.creatorCommitment.title");
                } else if (this.action === 'upVote') {
                    return this.$t("pages:feeds.menu.userUpVote.title");
                } else if (this.action === 'watch') {
                    return this.$t("pages:feeds.menu.watchesCommitment.title");
                }
            },
            creatorTitle() {
                if (this.creator && this.creator.isLoggedInUser && this.cardType === 'CommitmentAnswer') {
                    return this.$t("pages:feeds.menu.creatorAnswer.titleIsLoggedInUser");
                } else if (this.creator && this.creator.isLoggedInUser && this.cardType === 'Commitment') {
                    return this.$t("pages:feeds.menu.creatorCommitment.titleIsLoggedInUser");
                } else if (this.creator && !this.creator.isLoggedInUser && this.cardType === 'CommitmentAnswer') {
                    return this.$t("pages:feeds.menu.creatorAnswer.title");
                } else if (this.creator && !this.creator.isLoggedInUser && this.cardType === 'Commitment') {
                    return this.$t("pages:feeds.menu.creatorCommitment.title");
                }
            }
        }
    }
</script>

<style lang="scss">

</style>