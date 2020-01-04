<template>
    <div class="suggested-user">
        <div class="user-preview-img" @click="$router.push({name: 'user-userId-slug',
                            params: {userId: user.userId, slug: user.slug}})">
            <img :src="user.profileUrl">
        </div>
        <div class="user-content">
            <div class="user-name" @click="$router.push({name: 'user-userId-slug',
                            params: {userId: user.userId, slug: user.slug}})">
                {{user.name}}
            </div>

        </div>
        <v-spacer></v-spacer>
        <div class="user-actions">
            <v-tooltip bottom v-if="!user.userHasBeenAddedToTrustCircle && !loading">
                <template v-slot:activator="{ on }">
                    <v-btn icon v-on="on" @click="addUserToTrustCircle(user)">
                        <v-icon>{{$icons.mdiAccountPlusOutline}}</v-icon>
                    </v-btn>
                </template>
                <span>{{$t('pages:feeds.userSuggestion.addUser', {name: user.name})}}</span>
            </v-tooltip>
            <div class="adding-user-to-trust-circle-loading text-xs-center" v-else-if="loading">
                <v-progress-circular indeterminate color="primary" size="22"></v-progress-circular>
            </div>
        </div>
    </div>
</template>

<script>
    import Vue from 'vue';
    import {mdiAccountPlusOutline} from '@mdi/js';

    export default {
        props: ['user'],
        name: "userSuggestion",
        data() {
            return {loading: false}
        },
        created() {
            this.$icons = {mdiAccountPlusOutline}
        },
        methods: {
            async addUserToTrustCircle() {
                try {
                    this.loading = true;
                    let response = await this.$axios.$post(`user/trustCircle/${this.user.userId}`);
                    if (response && response.oneTimeNotificationCreated) {
                        this.$store.dispatch('notification/checkNotificationChanged');
                    }
                    this.$store.commit('feed/ADD_USER_TO_TRUST_CIRCLE', this.user.userId);
                    Vue.set(this.user, 'userHasBeenAddedToTrustCircle', true);
                    this.$emit('user-added-to-trust-circle')
                } catch (error) {

                } finally {
                    this.loading = false;
                }
            }
        },
        computed: {}
    }
</script>

<style lang="scss">
    .user-suggestion-container {
        .user-suggestion-content {
            .suggested-user {
                margin-top: 12px;
                display: flex;

                .user-preview-img {
                    width: 40px;
                    height: 40px;
                    flex: 0 0 40px;
                    margin-right: 8px;

                    img {
                        width: 100%;
                        height: 100%;
                        border-radius: 50%;
                    }
                }

                .user-content {
                    .user-name {
                        cursor: pointer;
                    }

                    :hover.user-name {
                        text-decoration: underline;
                    }
                }

                .user-actions {
                    button {
                        margin: 0;
                        color: #666666;

                        i.v-icon {
                            color: #666666;
                        }
                    }

                    .adding-user-to-trust-circle-loading {
                        width: 36px;
                        flex: 0 0 36px;
                    }
                }
            }
        }
    }
</style>