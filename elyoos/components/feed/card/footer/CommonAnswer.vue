<template>
    <div class="card-footer-feed">
        <div class="footer-icon" v-if="creator">
            <user-menu :menu-title="creatorTitle" :user-image="creator.userImagePreview"
                       :user-name="creator.name" :user-id="creator.userId" :user-slug="creator.slug"
                       :is-trust-user="creator.isTrustUser" :is-logged-in-user="creator.isLoggedInUser">
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
                       :is-trust-user="user.isTrustUser" :is-logged-in-user="user.isLoggedInUser">
                <div class="user-icon creator-icon" slot="icon">
                    <img :src="user.userImage">
                </div>
            </user-menu>
        </div>
        <div class="footer-icon" v-if="user">
            <v-icon medium v-if="action === 'created'" class="action-icon">
                mdi-comment-plus
            </v-icon>

            <v-icon medium v-if="action === 'upVote'" class="action-icon">
                mdi-thumb-up
            </v-icon>
            <span class="footer-description number" v-if="action === 'upVote'">{{numberOfUpVotes}}</span>
        </div>
    </div>
</template>

<script>
    import UserMenu from './menu/User';

    export default {
        props: ['creator', 'user', 'created', 'action', 'numberOfUpVotes'],
        components: {UserMenu},
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