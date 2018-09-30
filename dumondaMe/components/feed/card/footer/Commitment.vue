<template>
    <div class="card-footer-feed">
        <div class="footer-icon" v-if="cardType === 'CommitmentAnswer' || action">
            <user-menu :menu-title="userTitle" :user="user"
                       @add-trust-circle="(userId) => $emit('add-trust-circle', userId)"
                       @remove-trust-circle="(userId) => $emit('remove-trust-circle', userId)">
                <div class="user-icon creator-icon" slot="icon">
                    <img :src="user.userImage">
                </div>
            </user-menu>
        </div>
        <div class="footer-icon" v-if="action">
            <div class="footer-icon" v-if="action === 'watch'">
                <v-icon medium class="tooltip-icon">mdi-star</v-icon>
            </div>
            <v-tooltip bottom v-if="action === 'created' && cardType === 'Commitment'" class="footer-user-action">
                <v-icon medium slot="activator" class="tooltip-icon" v-if="cardType === 'Commitment'">
                    mdi-human-handsup
                </v-icon>
                <span v-if="user.isLoggedInUser">{{$t('common:you')}}
                    {{$t('pages:feeds.menu.creatorCommitment.titleIsLoggedInUser')}}
                    </span>
                <span v-else>{{user.name}}
                    {{$t('pages:feeds.menu.creatorCommitment.title')}}
                    </span>
            </v-tooltip>
            <v-tooltip bottom v-else-if="action === 'created' && cardType !== 'Commitment'" class="footer-user-action">
                <v-icon medium slot="activator" class="tooltip-icon">
                    mdi-comment-plus
                </v-icon>
                <span v-if="user.isLoggedInUser">{{$t('common:you')}}
                    {{$t('pages:feeds.menu.creatorAnswer.titleIsLoggedInUser')}}
                    </span>
                <span v-else>{{user.name}}
                    {{$t('pages:feeds.menu.creatorAnswer.title')}}
                </span>
            </v-tooltip>
            <v-tooltip bottom v-else-if="action === 'upVote'" class="footer-user-action">
                <v-icon medium slot="activator" class="tooltip-icon">
                    mdi-thumb-up
                </v-icon>
                <span v-if="user.isLoggedInUser">{{$t('common:you')}}
                    {{$t('pages:feeds.menu.userUpVote.titleIsLoggedInUser')}}
                </span>
                <span v-else>{{user.name}}
                    {{$t('pages:feeds.menu.userUpVote.title')}}
                </span>
            </v-tooltip>
        </div>
        <v-spacer v-if="action"></v-spacer>
        <div class="footer-icon" v-if="!action">
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
                    <span class="footer-description number right-number">{{numberOfWatches}}</span>
                </div>
            </watches-menu>
        </div>
        <div class="footer-icon footer-commitment-region-left-icon" v-if="cardType === 'CommitmentAnswer'">
            <region-menu :regions="regions">
                <div slot="icon">
                    <v-icon medium class="action-icon">mdi-map-marker</v-icon>
                </div>
            </region-menu>
        </div>
        <div class="footer-icon" v-if="cardType !== 'CommitmentAnswer'"
             :class="{'footer-commitment-region-right-icon': action}">
            <region-menu :regions="regions">
                <div slot="icon">
                    <v-icon medium class="action-icon">mdi-map-marker</v-icon>
                </div>
            </region-menu>
        </div>
        <div class="footer-icon footer-watches-button" v-if="cardType === 'Commitment' && action">
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
                    <span class="footer-description number-of-watches">{{numberOfWatches}}</span>
                    <v-btn slot="activator" small fab color="not-watching" v-if="!isWatchedByUser" :disabled="isAdmin">
                        <v-icon>mdi-star-outline</v-icon>
                    </v-btn>
                    <v-btn slot="activator" small fab color="watching" v-else>
                        <v-icon>mdi-star</v-icon>
                    </v-btn>
                </div>
            </watches-menu>
        </div>
        <div class="footer-icon" v-else-if="cardType === 'CommitmentAnswer' && action">
            <up-vote-button :number-of-up-votes="numberOfUpVotes" :is-up-voted-by-user="isUpVotedByUser"
                            :is-admin="isAdmin" :answer-id="answerId"
                            @up-voted="(answerId) => $emit('up-voted', answerId)"
                            @down-voted="(answerId) => $emit('down-voted', answerId)"
                            @up-vote-menu-closed="(data) => $emit('up-vote-menu-closed', data)">
            </up-vote-button>
        </div>
    </div>
</template>

<script>
    import UserMenu from './menu/User';
    import UpVoteButton from '~/components/question/answer/card/footer/UpVote';
    import WatchesMenu from './menu/Watches'
    import RegionMenu from './menu/Regions'

    export default {
        props: ['user', 'creator', 'created', 'action', 'regions', 'cardType', 'numberOfUpVotes', 'isUpVotedByUser',
            'numberOfWatches', 'isWatchedByUser', 'isAdmin', 'answerId', 'commitmentId'],
        components: {UserMenu, WatchesMenu, UpVoteButton, RegionMenu},
        computed: {
            userTitle() {
                let title = "title";
                if (this.user && this.user.isLoggedInUser) {
                    title = "titleIsLoggedInUser";
                }
                if (this.action === 'created' && this.cardType === 'CommitmentAnswer') {
                    return this.$t(`pages:feeds.menu.creatorAnswer.${title}`);
                } else if ((this.action === 'created' && this.cardType === 'Commitment') || !this.action) {
                    return this.$t(`pages:feeds.menu.creatorCommitment.${title}`);
                } else if (this.action === 'upVote') {
                    return this.$t(`pages:feeds.menu.userUpVote.${title}`);
                } else if (this.action === 'watch') {
                    return this.$t(`pages:feeds.menu.watchesCommitment.${title}`);
                } else if (!this.$store.state.auth.userIsAuthenticated) {
                    return this.$t(`pages:feeds.menu.creatorCommitment.title`);
                }
            }
        }
    }
</script>

<style lang="scss">
    .card-footer-feed {
        .footer-commitment-region-right-icon {
            margin-left: 22px;
        }
        .footer-commitment-region-left-icon {
            margin-right: 18px;
        }
    }
</style>