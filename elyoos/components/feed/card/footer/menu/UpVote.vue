<template>
    <v-menu v-model="menu" :close-on-content-click="false" offset-y>
        <slot name="icon" slot="activator"></slot>
        <v-card class="ely-menu-container">
            <div class="menu-title">
                <span v-if="!isLoggedInUser">
                    <span class="primary-title">{{userName}} </span>
                    <span v-if="localUpVotedByUser">{{$t('common:and')}} <span class="primary-title">{{$t('common:you')}}
                    </span>{{$t("pages:feeds.menu.userUpVote.titleTwoNames")}}</span>
                    <span v-else>{{$t("pages:feeds.menu.userUpVote.title")}}</span>
                </span>
                <span v-else>
                    <span class="primary-title">{{$t('common:you')}} </span>
                    <span v-if="localUpVotedByUser">{{$t("pages:feeds.menu.userUpVote.titleIsLoggedInUser")}}</span>
                    <span v-else>{{$t("pages:feeds.menu.userUpVote.titleIsLoggedInUserAndNotUpVoted")}}</span>
                </span>
            </div>
            <div class="menu-content menu-up-vote-content" v-if="numberOfShowedUsers > 0">
                <div class="more-user-description">
                    {{$t("pages:feeds.menu.userUpVote.moreUpVotes", {count: numberOfShowedUsers})}}
                </div>
                <div class="user-container">
                    <user :user="user" :show-date-relative="true" v-for="user in users.users" :key="user.userId"
                          v-if="user.userId !== userId">
                    </user>
                    <v-btn color="primary" outline class="show-more-users-button" @click="getNextUsers()"
                           v-if="users.hasMoreUsers" :loading="loadingNextUsers" :disabled="loadingNextUsers">
                        {{$t('common:button.showMore')}}
                    </v-btn>
                </div>
            </div>
            <v-divider></v-divider>
            <div class="menu-commands">
                <v-spacer></v-spacer>
                <v-btn flat color="primary" @click="menu = false">{{$t('common:button.close')}}</v-btn>
                <v-tooltip top debounce="300" v-if="localUpVotedByUser">
                    <v-btn color="primary" :disabled="isAdmin || upVoteRunning" @click="downVote()" slot="activator"
                           :loading="upVoteRunning">
                        <v-icon left>mdi-check</v-icon>
                        {{$t('common:button.upVote')}}
                    </v-btn>
                    <span>{{$t('common:feedCard.upVote.removeUpVote')}}</span>
                </v-tooltip>
                <v-tooltip top debounce="300" v-else>
                    <v-btn color="primary" :disabled="isAdmin || upVoteRunning" @click="upVote()" slot="activator"
                           :loading="upVoteRunning">
                        <v-icon left>mdi-thumb-up</v-icon>
                        {{$t('common:button.upVote')}}
                    </v-btn>
                    <span v-if="!isAdmin">{{$t('common:feedCard.upVote.addUpVote')}}</span>
                    <span v-else>{{$t('common:feedCard.upVote.userIsAdmin')}}</span>
                </v-tooltip>
            </div>
        </v-card>
    </v-menu>
</template>

<script>
    import User from '~/components/userProfile/trustCircle/User';

    export default {
        props: ['userName', 'userId', 'userSlug', 'isLoggedInUser', 'isAdmin', 'upVotedByUser', 'answerId',
            'numberOfUpVotes'],
        components: {User},
        data() {
            return {
                menu: false, upVoteRunning: false, showLoginRequired: false, localUpVotedByUser: this.upVotedByUser,
                users: null, usersPage: 0, loadingNextUsers: false
            }
        },
        computed: {
            numberOfShowedUsers() {
                if (this.users) {
                    return this.users.users.filter((user) => user.userId !== this.userId).length;
                }
                return 0;
            }
        },
        methods: {
            async voteCommand(upVote) {
                if (this.$store.state.auth.userIsAuthenticated) {
                    try {
                        this.upVoteRunning = true;
                        if (upVote) {
                            await this.$axios.$post(`/user/question/answer/upVote/${this.answerId}`);
                            this.$emit('up-voted', this.answerId);
                            this.localUpVotedByUser = true;
                        } else {
                            await this.$axios.$delete(`/user/question/answer/upVote/${this.answerId}`);
                            this.$emit('down-voted', this.answerId);
                            this.localUpVotedByUser = false;
                        }
                    } catch (error) {
                        this.showError = true;
                    } finally {
                        this.upVoteRunning = false;
                    }
                } else {
                    this.showLoginRequired = true;
                }
            },
            async upVote() {
                this.voteCommand(true);
            },
            async downVote() {
                this.voteCommand(false);
            },
            async getNextUsers() {
                try {
                    this.loadingNextUsers = true;
                    let nextUsers = await this.$axios.$get(`/question/answer/upVotes`,
                        {params: {answerId: this.answerId, page: this.usersPage}});
                    this.users.users = this.users.users.concat(nextUsers.users);
                    this.users.hasMoreUsers = nextUsers.hasMoreUsers;
                    this.usersPage++;
                } catch (error) {
                    this.showError = true;
                } finally {
                    this.loadingNextUsers = false;
                }
            }
        },
        watch: {
            async menu(open) {
                if (!open && this.isLoggedInUser) {
                    this.$emit('up-vote-menu-closed', {
                        answerId: this.answerId, isUpVotedByUser: this.localUpVotedByUser
                    });
                } else if (open && this.numberOfUpVotes > 0 && this.users === null) {
                    this.users = await this.$axios.$get(`/question/answer/upVotes`,
                        {params: {answerId: this.answerId, page: this.usersPage}});
                    this.usersPage++;
                }
            }
        }
    }
</script>

<style lang="scss">
    .ely-menu-container {
        .menu-up-vote-content {
            .more-user-description {
                font-size: 14px;
                margin-bottom: 18px;
            }
            .user-container {
                max-height: 336px;
                overflow-y: scroll;
                .show-more-users-button {
                    margin-left: 0;
                }
            }
        }
    }
</style>