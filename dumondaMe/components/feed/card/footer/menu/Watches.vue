<template>
    <div>
        <v-menu v-model="menu" :close-on-content-click="false" offset-y min-width="290">
            <template v-slot:activator="{ on }">
                <div v-on="on">
                    <slot name="icon"></slot>
                </div>
            </template>
            <v-card class="ely-menu-container ely-menu-watches-container" v-if="menu">
                <div class="menu-title">{{$t('pages:feeds.menu.'+ menuTranslation + '.moreWatches',
                    {count: numberOfShowedUsers})}}
                </div>
                <user-content v-if="numberOfShowedUsers > 0 && !loadWatchingUserRunning" :users="users.users"
                              :api-get-user="apiGetUserCommand" :init-has-more-users="users.hasMoreUsers"
                              :id="watchedId" :user-id="userId">
                </user-content>
                <div v-else-if="numberOfWatches === 0" class="watches-description">
                    {{$t('pages:feeds.menu.'+ menuTranslation + '.noWatches')}}
                </div>
                <div v-else-if="loadWatchingUserRunning" class="loading-watching-user-running">
                    <div class="text-xs-center">
                        <v-progress-circular indeterminate color="primary"></v-progress-circular>
                    </div>
                </div>
                <div v-else-if="numberOfWatches === 1 && watchedByUser" class="watches-description">
                    {{$t('pages:feeds.menu.'+ menuTranslation + '.userIsOnlyWatcher')}}
                </div>
                <v-divider></v-divider>
                <div class="menu-commands">
                    <v-spacer></v-spacer>
                    <v-btn text color="primary" @click="menu = false">{{$t('common:button.close')}}</v-btn>
                    <v-tooltip top debounce="300" v-if="localWatchedByUser">
                        <template v-slot:activator="{ on }">
                            <v-btn color="user-is-interested-button" :disabled="isAdmin || watchingRunning"
                                   @click="removeWatch()"
                                   v-on="on" :loading="watchingRunning">
                                <v-icon left>mdi-star</v-icon>
                                {{$t('common:button.interested')}}
                            </v-btn>
                        </template>
                        <span>{{$t('common:feedCard.watch.removeWatch')}}</span>
                    </v-tooltip>
                    <v-tooltip top debounce="300" v-else>
                        <template v-slot:activator="{ on }">
                            <v-btn color="primary" :disabled="isAdmin || watchingRunning"
                                   @click="addWatch()"
                                   v-on="on" :loading="watchingRunning">
                                <v-icon left>mdi-star-outline</v-icon>
                                {{$t('common:button.interested')}}
                            </v-btn>
                        </template>
                        <span v-if="!isAdmin">{{$t('common:feedCard.watch.addWatch')}}</span>
                        <span v-else>{{$t('common:feedCard.watch.userIsAdmin')}}</span>
                    </v-tooltip>
                </div>
            </v-card>
        </v-menu>
        <login-required-dialog v-if="showLoginRequired && menu" @close-dialog="showLoginRequired = false">
        </login-required-dialog>
        <v-snackbar top v-if="menu" v-model="showError" color="error" :timeout="0">{{$t("common:error.unknown")}}
            <v-btn dark text @click="showError = false">{{$t("common:button.close")}}</v-btn>
        </v-snackbar>
    </div>
</template>

<script>
    import UserContent from './UsersContainer';
    import LoginRequiredDialog from '~/components/common/dialog/LoginRequired';
    import Vue from 'vue';

    export default {
        props: ['userId', 'isLoggedInUser', 'isAdmin', 'watchedByUser', 'watchedId', 'watchedIdName', 'numberOfWatches',
            'apiWatch', 'apiGetUserCommand', 'menuTranslation'],
        components: {UserContent, LoginRequiredDialog},
        data() {
            return {
                menu: false, watchingRunning: false, showLoginRequired: false, localWatchedByUser: this.watchedByUser,
                users: null, showError: false, loadWatchingUserRunning: false
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
            async watch(watch) {
                if (this.$store.state.auth.userIsAuthenticated) {
                    try {
                        this.watchingRunning = true;
                        if (watch) {
                            let response = await this.$axios.$put(`${this.apiWatch}/${this.watchedId}`);
                            this.$emit('add-watch', this.watchedId);
                            this.localWatchedByUser = true;
                            if (response && response.oneTimeWatchingFirstQuestion) {
                                this.$store.dispatch('notification/checkNotificationChanged');
                            }
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
                if (!open && this.isLoggedInUser && !this.loadWatchingUserRunning && !this.showError) {
                    this.$emit('watch-menu-closed', {
                        questionId: this.questionId, isWatchedByUser: this.localWatchedByUser
                    });
                } else if (open && this.numberOfWatches > 0 && this.users === null && !this.loadWatchingUserRunning &&
                    !this.showError) {
                    try {
                        this.loadWatchingUserRunning = true;
                        this.users = await this.$axios.$get(this.apiGetUserCommand,
                            {params: {id: this.watchedId, page: 0}});
                        //Workaround to show menu after load of user data on correct position
                        this.menu = false;
                        await Vue.nextTick();
                        this.menu = true;
                    } catch (error) {
                        this.showError = true;
                    } finally {
                        this.loadWatchingUserRunning = false;
                    }
                }
            }
        }
    }
</script>

<style lang="scss">
    .ely-menu-container.ely-menu-watches-container {
        .watches-description {
            padding: 0 16px 12px 16px;
            max-width: 300px;
        }

        .loading-watching-user-running {
            margin-bottom: 12px;
        }

        .theme--light.user-is-interested-button.v-btn {
            background-color: $selected-button;
            color: white;

            i.v-icon {
                color: white;
            }
        }
    }
</style>