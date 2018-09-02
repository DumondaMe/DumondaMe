<template>
    <v-menu v-model="menu" :close-on-content-click="false" offset-y>
        <slot name="icon" slot="activator"></slot>
        <v-card class="ely-menu-container">
            <div class="menu-title">
                <span v-if="!isLoggedInUser">
                    <span class="primary-title" v-if="!isLoggedInUser">{{userName}} </span>
                    {{$t("pages:feeds.menu.userUpVote.title")}}
                </span>
                <span v-else>
                    <span class="primary-title">{{$t('common:you')}} </span>
                    <span v-if="localUpVotedByUser">{{$t("pages:feeds.menu.userUpVote.titleIsLoggedInUser")}}</span>
                    <span v-else>{{$t("pages:feeds.menu.userUpVote.titleIsLoggedInUserAndNotUpVoted")}}</span>
                </span>
            </div>
            <div class="menu-content menu-up-vote-content">

            </div>
            <v-divider></v-divider>
            <div class="menu-commands">
                <v-spacer></v-spacer>
                <v-btn flat color="primary" @click="menu = false">{{$t('common:button.close')}}</v-btn>
                <v-tooltip bottom debounce="300" v-if="localUpVotedByUser">
                    <v-btn color="primary" :disabled="isAdmin || upVoteRunning" @click="downVote()" slot="activator"
                           :loading="upVoteRunning">
                        <v-icon left>mdi-check</v-icon>
                        {{$t('common:button.upVote')}}
                    </v-btn>
                    <span>{{$t('common:feedCard.upVote.removeUpVote')}}</span>
                </v-tooltip>
                <v-tooltip bottom debounce="300" v-else>
                    <v-btn color="primary" :disabled="isAdmin || upVoteRunning" @click="upVote()" slot="activator"
                           :loading="upVoteRunning">
                        <v-icon left>mdi-thumb-up</v-icon>
                        {{$t('common:button.upVote')}}
                    </v-btn>
                    <span>{{$t('common:feedCard.upVote.addUpVote')}}</span>
                </v-tooltip>
            </div>
        </v-card>
    </v-menu>
</template>

<script>
    export default {
        props: ['userName', 'userId', 'userSlug', 'isLoggedInUser', 'isAdmin', 'upVotedByUser', 'answerId'],
        data() {
            return {menu: false, upVoteRunning: false, showLoginRequired: false, localUpVotedByUser: this.upVotedByUser}
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
            menu(open) {
                if (!open) {
                    this.$emit('up-vote-menu-closed', {
                        answerId: this.answerId, isUpVotedByUser: this.localUpVotedByUser
                    });
                }
            }
        }
    }
</script>

<style lang="scss">
    .ely-menu-container {
        .menu-up-vote-content {

        }
    }
</style>