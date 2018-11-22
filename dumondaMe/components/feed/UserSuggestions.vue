<template>
    <div class="user-suggestion-container ely-card">
        <h3 class="feed-desktop-sidebar-title">{{$t('pages:feeds.userSuggestion.title')}}</h3>
        <div class="user-suggestion-content" v-if="!loading && users.length > 0">
            <user-suggestion :user="user" v-for="user of users" :key="user.userId"
                             @user-added-to-trust-circle="userAddedToTrustCircle">
            </user-suggestion>
        </div>
        <div class="no-user-suggestion" v-else-if="!loading && users.length === 0">
            {{$t('pages:feeds.userSuggestion.noSuggestion')}}
        </div>
        <div class="user-suggestion-loading text-xs-center" v-else>
            <v-progress-circular indeterminate color="primary"></v-progress-circular>
        </div>
        <v-btn outline color="primary" v-if="hasMoreUsers && !reloadingButtonActive" class="loading-button"
               @click="loadNextUserSuggestion">
            {{$t('common:button.showMore')}}
        </v-btn>
        <v-btn outline color="primary" v-if="reloadingButtonActive" class="loading-button"
               @click="loadStartUserSuggestion">
            {{$t('pages:feeds.userSuggestion.reloadSuggestionButton')}}
        </v-btn>
    </div>
</template>

<script>
    import Vue from 'vue';
    import UserSuggestion from './UserSuggestion';

    export default {
        name: "userSuggestions",
        data() {
            return {
                users: [], hasMoreUsers: false, trustCircleSuggestion: true, loading: true, loadingButton: false,
                reloadingButtonActive: false
            }
        },
        components: {UserSuggestion},
        mounted: async function () {
            await this.loadStartUserSuggestion();
        },
        methods: {
            userAddedToTrustCircle() {
                this.reloadingButtonActive = true;
            },
            async loadNextUserSuggestion() {
                try {
                    this.loadingButton = true;
                    this.loadUserSuggestion(this.users.length, 10);
                } finally {
                    this.loadingButton = false;
                }
            },
            async loadStartUserSuggestion() {
                try {
                    this.loading = true;
                    this.users = [];
                    this.reloadingButtonActive = false;
                    await this.loadUserSuggestion(0, 7);
                } finally {
                    this.loading = false;
                }
            },
            async loadUserSuggestion(skip, limit) {
                let result = await this.$axios.$get('user/otherUser/suggestion', {params: {skip, limit}});
                for (let user of result.users) {
                    Vue.set(user, 'userHasBeenAddedToTrustCircle', false);
                }
                this.users = this.users.concat(result.users);
                this.hasMoreUsers = result.hasMoreUsers;
                this.trustCircleSuggestion = result.trustCircleSuggestion;
            }
        },
    }
</script>

<style lang="scss">
    .user-suggestion-container {
        margin-top: 18px;
        .user-suggestion-content {
            margin-top: 20px;
        }
        .no-user-suggestion {
            font-size: 14px;
            font-weight: 300;
        }
        .user-suggestion-loading {
            margin-top: 18px;
        }
        .loading-button {
            margin-top: 22px;
            margin-left: 0;
        }
    }
</style>