<template>
    <div class="card-footer-feed">
        <div class="footer-icon" v-if="creator">
            <user-menu :menu-title="creatorTitle" :user-image="creator.userImagePreview"
                       :user-name="creator.name" :user-id="creator.userId" :user-slug="creator.slug"
                       :is-trust-user="creator.isTrustUser" :is-logged-in-user="creator.isLoggedInUser"
                       @add-trust-circle="(userId) => $emit('add-trust-circle', userId)"
                       @remove-trust-circle="(userId) => $emit('remove-trust-circle', userId)">
                <div class="user-icon creator-icon" slot="icon">
                    <img :src="creator.userImage">
                </div>
            </user-menu>
        </div>
        <div class="separator-icon" v-if="creator">
            <v-icon medium>
                mdi-menu-right
            </v-icon>
        </div>
        <div class="footer-icon" v-if="user">
            <user-menu :menu-title="userTitle" :user-image="user.userImagePreview"
                       :user-name="user.name" :user-id="user.userId" :user-slug="user.slug"
                       :is-trust-user="user.isTrustUser" :is-logged-in-user="user.isLoggedInUser"
                       @add-trust-circle="(userId) => $emit('add-trust-circle', userId)"
                       @remove-trust-circle="(userId) => $emit('remove-trust-circle', userId)">
                <div class="user-icon creator-icon" slot="icon">
                    <img :src="user.userImage">
                </div>
            </user-menu>
        </div>
        <div class="footer-icon" v-if="user">
            <v-icon medium v-if="action === 'created'" class="action-icon">
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
    </div>
</template>

<script>
    import UserMenu from './menu/User';
    import UpVoteMenu from './menu/UpVote';

    export default {
        props: ['creator', 'user', 'action', 'numberOfUpVotes', 'isUpVotedByUser', 'answerId'],
        components: {UserMenu, UpVoteMenu},
        computed: {
            userTitle() {
                if (this.action === 'created') {
                    return this.$t("pages:feeds.menu.creatorAnswer.title");
                } else if (this.action === 'upVote') {
                    return this.$t("pages:feeds.menu.userUpVote.title");
                }
            },
            creatorTitle() {
                if (this.creator && this.creator.isLoggedInUser) {
                    return this.$t("pages:feeds.menu.creatorAnswer.titleIsLoggedInUser");
                }
                return this.$t("pages:feeds.menu.creatorAnswer.title");
            }
        }
    }
</script>

<style lang="scss">

</style>