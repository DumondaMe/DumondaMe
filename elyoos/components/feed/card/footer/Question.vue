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
        <div class="separator-icon" v-if="creator && user">
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
        <div class="footer-icon">
            <v-icon medium v-if="action === 'watch'" class="action-icon">mdi-star</v-icon>
        </div>
        <div class="footer-icon">
            <v-icon medium class="action-icon no-answers" v-if="numberOfAnswers === 0">mdi-comment-alert</v-icon>
            <v-icon medium class="action-icon only-few-answers" v-else-if="numberOfAnswers > 0 && numberOfAnswers <= 4">
                mdi-comment-alert
            </v-icon>
            <v-icon medium class="action-icon" v-else>mdi-comment-multiple</v-icon>
        </div>
    </div>
</template>

<script>
    import UserMenu from './menu/User';

    export default {
        props: ['creator', 'user', 'created', 'numberOfAnswers', 'action'],
        components: {UserMenu},
        computed: {
            userTitle() {
                if (this.action === 'created') {
                    return this.$t("pages:feeds.menu.creatorQuestion.title");
                } else if (this.action === 'watch') {
                    return this.$t("pages:feeds.menu.userInterestedInQuestion.title");
                }
            },
            creatorTitle() {
                if (this.creator && this.creator.isLoggedInUser) {
                    return this.$t("pages:feeds.menu.creatorQuestion.titleIsLoggedInUser");
                }
                return this.$t("pages:feeds.menu.creatorQuestion.title");
            }
        }
    }
</script>

<style lang="scss">
    .card-footer-feed {
        .footer-icon {
            .action-icon.no-answers {
                color: $warning
            }
            .action-icon.only-few-answers {
                color: #bfbc12
            }
        }
    }
</style>