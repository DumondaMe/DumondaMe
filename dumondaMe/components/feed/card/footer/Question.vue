<template>
    <div class="card-footer-feed">
        <div class="footer-icon" v-if="user">
            <user-menu :menu-title="userTitle" :user="user"
                       @add-trust-circle="(userId) => $emit('add-trust-circle', userId)"
                       @remove-trust-circle="(userId) => $emit('remove-trust-circle', userId)">
                <div class="user-icon creator-icon" slot="icon">
                    <img :src="user.userImage">
                </div>
            </user-menu>
        </div>
        <div class="footer-icon" v-if="action === 'watch'">
            <v-icon medium class="tooltip-icon">mdi-star</v-icon>
        </div>
        <div class="footer-icon" v-if="action === 'created'">
            <v-icon medium class="tooltip-icon">mdi-comment-question</v-icon>
        </div>
        <v-spacer v-if="action"></v-spacer>
        <div class="footer-icon">
            <watches-menu :user-id="user.userId" :watched-id="questionId" watched-id-name="questionId"
                          :is-watching-action="false"
                          :user-slug="user.slug" :is-logged-in-user="true" :is-admin="user.isLoggedInUser"
                          :watched-by-user="isWatchedByUser" :number-of-watches="numberOfWatches"
                          menu-translation="watchesQuestion" api-get-user-command="question/watches"
                          api-watch="user/question/watch"
                          @add-watch="(id) => $emit('add-watch', id)"
                          @remove-watch="(id) => $emit('remove-watch', id)"
                          @watch-menu-closed="(data) => $emit('watch-menu-closed', data)">
                <div slot="icon">
                    <div v-if="action">
                        <span class="footer-description number left-number">{{numberOfWatches}}</span>
                        <v-icon medium class="action-icon">mdi-star</v-icon>
                    </div>
                    <div v-else>
                        <v-icon medium class="action-icon">mdi-star</v-icon>
                        <span class="footer-description number right-number">{{numberOfWatches}}</span>
                    </div>
                </div>
            </watches-menu>
        </div>
        <div class="footer-icon">
            <v-tooltip bottom>
                <div slot="activator">
                    <span class="footer-description number left-number" v-if="action">{{numberOfAnswers}}</span>
                    <v-icon medium class="tooltip-icon no-answers" v-if="numberOfAnswers === 0">mdi-comment-alert
                    </v-icon>
                    <v-icon medium class="tooltip-icon" v-else>mdi-comment</v-icon>
                    <span class="footer-description number right-number" v-if="!action">{{numberOfAnswers}}</span>
                </div>
                <span v-if="numberOfAnswers === 0">{{$t('pages:feeds.menu.questions.noAnswers')}}</span>
                <span v-else>{{$t('pages:feeds.menu.questions.numberOfAnswers', {count: numberOfAnswers})}}</span>
            </v-tooltip>
        </div>
    </div>
</template>

<script>
    import UserMenu from './menu/User';
    import WatchesMenu from './menu/Watches'

    export default {
        props: ['creator', 'user', 'created', 'numberOfAnswers', 'numberOfWatches', 'isWatchedByUser', 'action',
            'questionId'],
        components: {UserMenu, WatchesMenu},
        computed: {
            userTitle() {
                if (this.action === 'created' || !this.$store.state.auth.userIsAuthenticated) {
                    return this.$t("pages:feeds.menu.creatorQuestion.title");
                } else if (this.action === 'watch' && this.user && !this.user.isLoggedInUser) {
                    return this.$t("pages:feeds.menu.watchesQuestion.title");
                } else if (this.action === 'watch' && this.user && this.user.isLoggedInUser) {
                    return this.$t("pages:feeds.menu.watchesQuestion.titleIsLoggedInUser");
                } else if (!this.action && this.user && this.user.isLoggedInUser) {
                    return this.$t("pages:feeds.menu.creatorQuestion.titleIsLoggedInUser");
                } else if (!this.action && this.user && !this.user.isLoggedInUser) {
                    return this.$t("pages:feeds.menu.creatorQuestion.title");
                }
            }
        }
    }
</script>

<style lang="scss">
    .card-footer-feed {
        .footer-icon {
            .tooltip-icon.no-answers.v-icon {
                color: $warning
            }
        }
    }
</style>