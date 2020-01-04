<template>
    <div class="card-footer-feed">
        <div class="footer-icon" v-if="user">
            <user-menu :menu-title="userTitle" :user="user"
                       @add-trust-circle="(userId) => $emit('add-trust-circle', userId)"
                       @remove-trust-circle="(userId) => $emit('remove-trust-circle', userId)">
                <div class="user-icon creator-icon" slot="icon">
                    <img v-lazy="user.userImage">
                </div>
            </user-menu>
        </div>
        <div class="footer-icon" v-if="action === 'watch'">
            <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                    <v-icon medium class="main-action-icon" v-on="on">$vuetify.icons.mdiStar</v-icon>
                </template>
                <span v-if="user.isLoggedInUser">{{$t('common:you')}}
                    {{$t('pages:feeds.menu.watchesQuestion.titleIsLoggedInUser')}}</span>
                <span v-else>{{user.name}} {{$t('pages:feeds.menu.watchesQuestion.title')}}</span>
            </v-tooltip>
        </div>
        <div class="footer-icon" v-if="action === 'created'">
            <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                    <v-icon medium class="main-action-icon" v-on="on">{{$icons.mdiCommentQuestion}}</v-icon>
                </template>
                <span v-if="user.isLoggedInUser">{{$t('common:you')}}
                    {{$t('pages:feeds.menu.creatorQuestion.titleIsLoggedInUser')}}</span>
                <span v-else>{{user.name}} {{$t('pages:feeds.menu.creatorQuestion.title')}}</span>
            </v-tooltip>
        </div>
        <v-spacer v-if="action"></v-spacer>
        <div class="footer-icon" v-if="!action">
            <watches-menu :user-id="user.userId" :watched-id="questionId" watched-id-name="questionId"
                          :is-watching-action="false"
                          :user-slug="user.slug" :is-logged-in-user="user.isLoggedInUser" :is-admin="isAdmin"
                          :watched-by-user="isWatchedByUser" :number-of-watches="numberOfWatches"
                          menu-translation="watchesQuestion" api-get-user-command="question/watches"
                          api-watch="user/question/watch"
                          @add-watch="(id) => $emit('add-watch', id)"
                          @remove-watch="(id) => $emit('remove-watch', id)"
                          @watch-menu-closed="(data) => $emit('watch-menu-closed', data)">
                <v-tooltip slot="icon" bottom>
                    <template v-slot:activator="{ on }">
                        <v-icon medium class="action-icon" v-on="on">$vuetify.icons.mdiStar</v-icon>
                        <span class="footer-description number right-number" v-on="on">{{numberOfWatches}}</span>
                    </template>
                    <span>{{$t('common:feedCard.watch.numberOfInterested', {count: numberOfWatches})}}</span>
                </v-tooltip>
            </watches-menu>
        </div>
        <div class="footer-icon">
            <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                    <div v-on="on" @click="$router.push({name: 'question-questionId-slug',
                     params: {questionId: questionId, slug: questionSlug}})">
                        <span class="footer-description number left-number" v-if="action">{{numberOfAnswers}}</span>
                        <v-icon medium class="action-icon no-answers comment-icon" v-if="numberOfAnswers === 0">
                            {{$icons.mdiCommentAlert}}
                        </v-icon>
                        <v-icon medium class="action-icon comment-icon" v-else>{{$icons.mdiComment}}</v-icon>
                        <span class="footer-description number right-number" v-if="!action">{{numberOfAnswers}}</span>
                    </div>
                </template>
                <span v-if="numberOfAnswers === 0">{{$t('pages:feeds.menu.questions.noAnswers')}}</span>
                <span v-else>{{$t('pages:feeds.menu.questions.numberOfAnswers', {count: numberOfAnswers})}}</span>
            </v-tooltip>
        </div>
        <div class="footer-icon footer-watches-button" v-if="action">
            <watches-menu :user-id="user.userId" :watched-id="questionId" watched-id-name="questionId"
                          :is-watching-action="false"
                          :user-slug="user.slug" :is-logged-in-user="user.isLoggedInUser" :is-admin="isAdmin"
                          :watched-by-user="isWatchedByUser" :number-of-watches="numberOfWatches"
                          menu-translation="watchesQuestion" api-get-user-command="question/watches"
                          api-watch="user/question/watch"
                          @add-watch="(id) => $emit('add-watch', id)"
                          @remove-watch="(id) => $emit('remove-watch', id)"
                          @watch-menu-closed="(data) => $emit('watch-menu-closed', data)">
                <div slot="icon">
                    <span class="footer-description number-of-watches">{{numberOfWatches}}</span>
                    <v-tooltip bottom slot="icon">
                        <template v-slot:activator="{ on }">
                            <v-btn v-on="on" small fab color="not-watching" v-if="!isWatchedByUser"
                                   :disabled="isAdmin">
                                <v-icon color="white">$vuetify.icons.mdiStarOutline</v-icon>
                            </v-btn>
                            <v-btn v-on="on" small fab color="watching" v-else>
                                <v-icon color="white">$vuetify.icons.mdiStar</v-icon>
                            </v-btn>
                        </template>
                        <span v-if="isAdmin">{{$t('common:you')}}
                            {{$t('pages:feeds.menu.creatorQuestion.titleIsLoggedInUser')}}</span>
                        <span v-else-if="!isWatchedByUser">
                            {{$t('common:feedCard.watch.userHasNotWatched')}}</span>
                        <span v-else>{{$t('common:you')}}
                            {{$t('pages:feeds.menu.watchesQuestion.titleIsLoggedInUser')}}</span>
                    </v-tooltip>
                </div>
            </watches-menu>
        </div>
    </div>
</template>

<script>
    import UserMenu from './menu/User';
    import WatchesMenu from './menu/Watches'
    import {mdiCommentQuestion, mdiComment, mdiCommentAlert} from "@mdi/js";

    export default {
        props: ['creator', 'user', 'created', 'numberOfAnswers', 'numberOfWatches', 'isWatchedByUser', 'isAdmin',
            'action', 'questionId', 'questionSlug'],
        components: {UserMenu, WatchesMenu},
        created() {
            this.$icons = {mdiCommentQuestion, mdiComment, mdiCommentAlert}
        },
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