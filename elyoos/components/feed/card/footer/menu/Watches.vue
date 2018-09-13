<template>
    <div>
        <v-menu v-model="menu" :close-on-content-click="false" offset-y>
            <slot name="icon" slot="activator"></slot>
            <v-card class="ely-menu-container ely-menu-watches-container">
                <div v-if="isAuthenticated">
                    <div class="menu-title" v-if="isLoggedInUser && isWatchingAction">
                        <span class="primary-title">{{$t('common:you')}} </span>
                        <span v-if="localWatchedByUser">{{$t("pages:feeds.menu." + menuTranslation + ".titleIsLoggedInUser")}}</span>
                        <span v-else>{{$t("pages:feeds.menu." + menuTranslation + ".titleIsLoggedInUserAndNotWatched")}}</span>
                    </div>
                    <div class="menu-title" v-else-if="!isLoggedInUser && isWatchingAction">
                        <span class="primary-title">{{userName}} </span>
                        <span v-if="localWatchedByUser">{{$t('common:and')}}
                            <span class="primary-title">{{$t('common:you')}}
                        </span>{{$t("pages:feeds.menu." + menuTranslation + ".titleTwoNames")}}</span>
                        <span v-else>{{$t("pages:feeds.menu." + menuTranslation + ".title")}}</span>
                    </div>
                    <div class="menu-title" v-else-if="!isWatchingAction && !isAdmin">
                        <span class="primary-title">{{$t('common:you')}} </span>
                        <span v-if="localWatchedByUser">{{$t("pages:feeds.menu." + menuTranslation + ".titleIsLoggedInUser")}}</span>
                        <span v-else>{{$t("pages:feeds.menu." + menuTranslation + ".titleIsLoggedInUserAndNotWatched")}}</span>
                    </div>
                </div>
                <user-content v-if="numberOfShowedUsers > 0" :users="users.users"
                              :api-get-user="apiGetUserCommand" :init-has-more-users="users.hasMoreUsers"
                              :id="watchedId" :user-id="userId"
                              :user-description="$t('pages:feeds.menu.'+ menuTranslation + '.moreWatches',
                          {count: numberOfShowedUsers})">
                </user-content>
                <div v-else-if="numberOfWatches === 0" class="no-watches-description">
                    {{$t('pages:feeds.menu.'+ menuTranslation + '.noWatches')}}
                </div>
                <v-divider></v-divider>
                <div class="menu-commands">
                    <v-spacer></v-spacer>
                    <v-btn flat color="primary" @click="menu = false">{{$t('common:button.close')}}</v-btn>
                    <v-tooltip top debounce="300" v-if="localWatchedByUser">
                        <v-btn color="primary" :disabled="isAdmin || watchingRunning" @click="removeWatch()"
                               slot="activator" :loading="watchingRunning">
                            <v-icon left>mdi-check</v-icon>
                            {{$t('common:button.interested')}}
                        </v-btn>
                        <span>{{$t('common:feedCard.watch.removeWatch')}}</span>
                    </v-tooltip>
                    <v-tooltip top debounce="300" v-else>
                        <v-btn color="primary" :disabled="isAdmin || watchingRunning" @click="addWatch()"
                               slot="activator" :loading="watchingRunning">
                            <v-icon left>mdi-star</v-icon>
                            {{$t('common:button.interested')}}
                        </v-btn>
                        <span v-if="!isAdmin">{{$t('common:feedCard.watch.addWatch')}}</span>
                        <span v-else>{{$t('common:feedCard.watch.userIsAdmin')}}</span>
                    </v-tooltip>
                </div>
            </v-card>
        </v-menu>
        <login-required-dialog v-if="showLoginRequired" @close-dialog="showLoginRequired = false">
        </login-required-dialog>
        <v-snackbar top v-model="showError" color="error" :timeout="0">{{$t("common:error.unknown")}}
            <v-btn dark flat @click="showError = false">{{$t("common:button.close")}}</v-btn>
        </v-snackbar>
    </div>
</template>

<script>
    import UserContent from './UsersContainer';
    import LoginRequiredDialog from '~/components/common/dialog/LoginRequired';

    export default {
        props: ['userName', 'userId', 'userSlug', 'isLoggedInUser', 'isWatchingAction', 'isAdmin', 'watchedByUser',
            'watchedId', 'watchedIdName', 'numberOfWatches', 'apiWatch', 'apiGetUserCommand', 'menuTranslation'],
        components: {UserContent, LoginRequiredDialog},
        data() {
            return {
                menu: false, watchingRunning: false, showLoginRequired: false, localWatchedByUser: this.watchedByUser,
                users: null, showError: false
            }
        },
        computed: {
            numberOfShowedUsers() {
                if (this.users) {
                    return this.users.users.filter((user) => user.userId !== this.userId).length;
                }
                return 0;
            },
            isAuthenticated() {
                return this.$store.state.auth.userIsAuthenticated
            }
        },
        methods: {
            async watch(watch) {
                if (this.$store.state.auth.userIsAuthenticated) {
                    try {
                        this.watchingRunning = true;
                        if (watch) {
                            await this.$axios.$put(`${this.apiWatch}/${this.watchedId}`);
                            this.$emit('add-watch', this.watchedId);
                            this.localWatchedByUser = true;
                        } else {
                            let params = {};
                            params[this.watchedIdName] = this.watchedId;
                            await this.$axios.$delete(`${this.apiWatch}`, {params: params});
                            this.$emit('remove-watch', this.watchedId);
                            this.localWatchedByUser = false;
                        }
                    } catch (error) {
                        this.showError = true;
                    } finally {
                        this.watchingRunning = false;
                    }
                } else {
                    this.showLoginRequired = true;
                }
            },
            async removeWatch() {
                this.watch(false);
            },
            async addWatch() {
                this.watch(true);
            }
        },
        watch: {
            async menu(open) {
                if (!open && this.isLoggedInUser) {
                    this.$emit('watch-menu-closed', {
                        questionId: this.questionId, isWatchedByUser: this.localWatchedByUser
                    });
                } else if (open && this.numberOfWatches > 0 && this.users === null) {
                    this.users = await this.$axios.$get(this.apiGetUserCommand,
                        {params: {id: this.watchedId, page: 0}});
                }
            }
        }
    }
</script>

<style lang="scss">
    .ely-menu-container.ely-menu-watches-container {
        .no-watches-description {
            padding: 12px 16px;
        }
    }
</style>