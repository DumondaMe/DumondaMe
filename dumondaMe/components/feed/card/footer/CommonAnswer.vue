<template>
    <div class="card-footer-feed">
        <div class="footer-icon">
            <user-menu :menu-title="userTitle" :user="user"
                       @add-trust-circle="(userId) => $emit('add-trust-circle', userId)"
                       @remove-trust-circle="(userId) => $emit('remove-trust-circle', userId)">
                <div class="user-icon creator-icon" slot="icon">
                    <img :src="user.userImage">
                </div>
            </user-menu>
        </div>
        <div class="footer-icon">
            <v-tooltip bottom v-if="action === 'created'" class="footer-user-action">
                <v-icon medium slot="activator" class="main-action-icon">
                    mdi-comment-plus
                </v-icon>
                <span v-if="user.isLoggedInUser">{{$t('common:you')}}
                    {{$t('pages:feeds.menu.creatorAnswer.titleIsLoggedInUser')}}
                </span>
                <span v-else>{{user.name}}
                    {{$t('pages:feeds.menu.creatorAnswer.title')}}
                </span>
            </v-tooltip>
            <v-tooltip bottom v-if="action === 'upVote'" class="footer-user-action">
                <v-icon medium slot="activator" class="main-action-icon">
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
        <v-spacer></v-spacer>
        <div class="footer-icon common-answer-up-vote-feed">
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

    export default {
        props: ['creator', 'user', 'action', 'numberOfUpVotes', 'isUpVotedByUser', 'isAdmin', 'answerId'],
        components: {UserMenu, UpVoteButton},
        computed: {
            userTitle() {
                if (this.action === 'created') {
                    if (this.user && this.user.isLoggedInUser) {
                        return this.$t("pages:feeds.menu.creatorAnswer.titleIsLoggedInUser");
                    }
                    return this.$t("pages:feeds.menu.creatorAnswer.title");
                } else if (this.action === 'upVote') {
                    if (this.user && this.user.isLoggedInUser) {
                        return this.$t("pages:feeds.menu.userUpVote.titleIsLoggedInUser");
                    }
                    return this.$t("pages:feeds.menu.userUpVote.title")
                }
            }
        }
    }
</script>

<style lang="scss">
</style>