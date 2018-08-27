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
            <v-icon medium v-if="action === 'watch'" class="action-icon">mdi-star</v-icon>
            <span class="footer-description number" v-if="action === 'watch'">{{numberOfWatches}}</span>

            <v-icon medium v-if="action === 'created' && cardType === 'CommitmentAnswer'"
                    class="action-icon">
                mdi-comment-plus
            </v-icon>

            <v-icon medium v-if="action === 'upVote'" class="action-icon">
                mdi-thumb-up
            </v-icon>
            <span class="footer-description number" v-if="action === 'upVote'">{{numberOfUpVotes}}</span>
        </div>
        <div class="footer-icon">
            <v-icon medium class="action-icon">mdi-map-marker</v-icon>
            <span class="footer-description number">{{regions.length}}</span>
        </div>
    </div>
</template>

<script>
    import UserMenu from './menu/User';

    export default {
        props: ['user', 'creator', 'created', 'action', 'regions', 'cardType', 'numberOfUpVotes', 'numberOfWatches'],
        components: {UserMenu},
        computed: {
            userTitle() {
                if (this.action === 'created' && this.cardType === 'CommitmentAnswer') {
                    return this.$t("pages:feeds.menu.creatorAnswer.title");
                } else if (this.action === 'created' && this.cardType === 'Commitment') {
                    return this.$t("pages:feeds.menu.creatorCommitment.title");
                } else if (this.action === 'upVote') {
                    return this.$t("pages:feeds.menu.userUpVote.title");
                } else if (this.action === 'watch') {
                    return this.$t("pages:feeds.menu.userInterestedInCommitment.title");
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