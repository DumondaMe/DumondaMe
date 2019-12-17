<template>
    <v-menu v-model="menu" :close-on-content-click="false" offset-y min-width="290">
        <template v-slot:activator="{ on }">
            <div v-on="on">
                <slot name="icon"></slot>
            </div>
        </template>
        <v-card class="ely-menu-container up-vote-menu-container" v-if="menu">
            <div class="menu-title" v-if="numberOfShowedUsers > 0">
                {{$t('pages:feeds.menu.userUpVote.moreUpVotes', {count: numberOfShowedUsers})}}
            </div>
            <user-content v-if="numberOfShowedUsers > 0" :users="users.users"
                          api-get-user="/question/answer/upVotes" :init-has-more-users="users.hasMoreUsers"
                          :id="answerId" :user-id="userId">
            </user-content>
            <div v-else-if="numberOfUpVotes === 0" class="up-votes-description">
                {{$t('pages:feeds.menu.userUpVote.noUpVotes')}}
            </div>
            <div v-else-if="loadUpVotedUserRunning" class="loading-up-voted-user-running">
                <div class="text-xs-center">
                    <v-progress-circular indeterminate color="primary"></v-progress-circular>
                </div>
            </div>
            <div v-else-if="numberOfUpVotes === 1 && upVotedByUser" class="up-votes-description">
                {{$t('pages:feeds.menu.userUpVote.userIsOnlyUpVoter')}}
            </div>
            <v-divider></v-divider>
            <div class="menu-commands">
                <v-spacer></v-spacer>
                <v-btn text color="primary" @click="menu = false">{{$t('common:button.close')}}</v-btn>
                <v-tooltip top debounce="300" v-if="localUpVotedByUser">
                    <template v-slot:activator="{ on }">
                        <v-btn color="user-has-up-voted-button" :disabled="isAdmin || upVoteRunning" @click="downVote()"
                               v-on="on" :loading="upVoteRunning">
                            <v-icon left>mdi-thumb-up</v-icon>
                            {{$t('common:button.upVote')}}
                        </v-btn>
                    </template>
                    <span>{{$t('common:feedCard.upVote.removeUpVote')}}</span>
                </v-tooltip>
                <v-tooltip top debounce="300" v-else>
                    <template v-slot:activator="{ on }">
                        <v-btn color="primary" :disabled="isAdmin || upVoteRunning" @click="upVote()" v-on="on"
                               :loading="upVoteRunning">
                            <v-icon left>mdi-thumb-up-outline</v-icon>
                            {{$t('common:button.upVote')}}
                        </v-btn>
                    </template>
                    <span v-if="!isAdmin">{{$t('common:feedCard.upVote.addUpVote')}}</span>
                    <span v-else>{{$t('common:feedCard.upVote.userIsAdmin')}}</span>
                </v-tooltip>
            </div>
        </v-card>
        <login-required-dialog v-if="showLoginRequired && menu" @close-dialog="showLoginRequired = false">
        </login-required-dialog>
        <v-snackbar top v-if="menu" v-model="showError" color="error" :timeout="0">{{$t("common:error.unknown")}}
            <v-btn dark text @click="showError = false">{{$t("common:button.close")}}</v-btn>
        </v-snackbar>
    </v-menu>
</template>

<script>
    import UserContent from './UsersContainer';
    import LoginRequiredDialog from '~/components/common/dialog/LoginRequired';
    import Vue from 'vue';

    export default {
        props: ['userId', 'isLoggedInUser', 'isAdmin', 'upVotedByUser', 'answerId', 'numberOfUpVotes'],
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
            },
            isAuthenticated() {
                return this.$store.state.auth.userIsAuthenticated
            }
        },
        methods: {
            async voteCommand(upVote) {
                if (this.$store.state.auth.userIsAuthenticated) {
                    try {
                        this.upVoteRunning = true;
                        if (upVote) {
                            let response = await this.$axios.$post(`/user/question/answer/upVote/${this.answerId}`);
                            this.$emit('up-voted', this.answerId);
                            this.localUpVotedByUser = true;
                            if (response && response.oneTimeNotificationCreated) {
                                this.$store.dispatch('notification/checkNotificationChanged');
                            }
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
                if (!open && this.isLoggedInUser && !this.loadUpVotedUserRunning && !this.showError) {
                    this.$emit('up-vote-menu-closed', {
                        answerId: this.answerId, isUpVotedByUser: this.localUpVotedByUser
                    });
                } else if (open && this.numberOfUpVotes > 0 && this.users === null && !this.loadUpVotedUserRunning &&
                    !this.showError) {
                    try {
                        this.loadUpVotedUserRunning = true;
                        this.users = await this.$axios.$get(`/question/answer/upVotes`,
                            {params: {id: this.answerId, page: 0}});
                        //Workaround to show menu after load of user data on correct position
                        this.menu = false;
                        await Vue.nextTick();
                        this.menu = true;
                    } catch (error) {
                        this.showError = true;
                    } finally {
                        this.loadUpVotedUserRunning = false;
                    }
                }
            }
        }
    }
</script>

<style lang="scss">
    .ely-menu-container.up-vote-menu-container {
        .menu-title {
            padding-bottom: 0;
        }

        .up-votes-description {
            padding: 12px 16px 12px 16px;
        }

        .loading-up-voted-user-running {
            margin-bottom: 12px;
        }

        .theme--light.user-has-up-voted-button.v-btn {
            background-color: $selected-button;
            color: white;

            i.v-icon {
                color: white;
            }
        }
    }
</style>