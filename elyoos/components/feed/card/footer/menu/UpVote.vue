<template>
    <v-menu v-model="menu" :close-on-content-click="false" offset-y lazy>
        <slot name="icon" slot="activator"></slot>
        <v-card class="ely-menu-container up-vote-menu-container">
            <div class="menu-title" v-if="customTextHasUpVoted && customTextHasNotUpVoted">
                <span class="primary-title">{{$t('common:you')}} </span>
                <span v-if="isAdmin" v-html="customTextIsAdmin"></span>
                <span v-else-if="localUpVotedByUser" v-html="customTextHasUpVoted"></span>
                <span v-else v-html="customTextHasNotUpVoted"></span>
            </div>
            <div class="menu-title" v-else>
                <span v-if="!isLoggedInUser">
                    <span class="primary-title">{{userName}} </span>
                    <span v-if="localUpVotedByUser">{{$t('common:and')}} <span class="primary-title">{{$t('common:you')}}
                    </span>{{$t("pages:feeds.menu.userUpVote.titleTwoNames")}}</span>
                    <span v-else>{{$t("pages:feeds.menu.userUpVote.title")}}</span>
                </span>
                <span v-else-if="isAdmin">
                    <span class="primary-title">{{$t('common:you')}} </span>
                    <span>{{$t("pages:feeds.menu.userUpVote.titleIsAdmin")}}</span>
                </span>
                <span v-else>
                    <span class="primary-title">{{$t('common:you')}} </span>
                    <span v-if="localUpVotedByUser">{{$t("pages:feeds.menu.userUpVote.titleIsLoggedInUser")}}</span>
                    <span v-else>{{$t("pages:feeds.menu.userUpVote.titleIsLoggedInUserAndNotUpVoted")}}</span>
                </span>
            </div>
            <user-content v-if="numberOfShowedUsers > 0" :users="users.users"
                          api-get-user="/question/answer/upVotes" :init-has-more-users="users.hasMoreUsers"
                          :id="answerId" :user-id="userId"
                          :user-description="$t('pages:feeds.menu.userUpVote.moreUpVotes',
                          {count: numberOfShowedUsers})">
            </user-content>
            <div v-else-if="numberOfUpVotes === 0" class="no-up-votes-description">
                {{$t('pages:feeds.menu.userUpVote.noWatches')}}
            </div>
            <div v-else-if="loadUpVotedUserRunning" class="loading-up-voted-user-running">
                <div class="text-xs-center">
                    <v-progress-circular indeterminate color="primary"></v-progress-circular>
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
        <login-required-dialog v-if="showLoginRequired" @close-dialog="showLoginRequired = false">
        </login-required-dialog>
        <v-snackbar top v-model="showError" color="error" :timeout="0">{{$t("common:error.unknown")}}
            <v-btn dark flat @click="showError = false">{{$t("common:button.close")}}</v-btn>
        </v-snackbar>
    </v-menu>
</template>

<script>
    import UserContent from './UsersContainer';
    import LoginRequiredDialog from '~/components/common/dialog/LoginRequired';
    import Vue from 'vue';

    export default {
        props: ['userName', 'userId', 'userSlug', 'isLoggedInUser', 'isAdmin', 'upVotedByUser', 'answerId',
            'numberOfUpVotes', 'customTextHasUpVoted', 'customTextHasNotUpVoted', 'customTextIsAdmin'],
        components: {UserContent, LoginRequiredDialog},
        data() {
            return {
                menu: false, upVoteRunning: false, showLoginRequired: false, localUpVotedByUser: this.upVotedByUser,
                users: null, showError: false, loadUpVotedUserRunning: false
            }
        },
        computed: {
            numberOfShowedUsers() {
                if (this.users) {
                    return this.users.users.filter((user) => user.userId !== this.userId || user.isAnonymous).length;
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
            }
        },
        watch: {
            async menu(open) {
                if (!open && this.isLoggedInUser && !this.loadUpVotedUserRunning) {
                    this.$emit('up-vote-menu-closed', {
                        answerId: this.answerId, isUpVotedByUser: this.localUpVotedByUser
                    });
                }
                else if (open && this.numberOfUpVotes > 0 && this.users === null && !this.loadUpVotedUserRunning) {
                    try {
                        this.loadUpVotedUserRunning = true;
                        this.users = await this.$axios.$get(`/question/answer/upVotes`,
                            {params: {id: this.answerId, page: 0}});
                    } catch (error) {
                        this.showError = true;
                    } finally {
                        //Workaround to show menu after load of user data on correct position
                        this.menu = false;
                        await Vue.nextTick();
                        this.menu = true;
                        this.loadUpVotedUserRunning = false;
                    }
                }
            }
        }
    }
</script>

<style lang="scss">
    .ely-menu-container.up-vote-menu-container {
        .no-up-votes-description {
            padding: 12px 16px;
        }

        .loading-up-voted-user-running {
            margin-bottom: 12px;
        }
    }
</style>