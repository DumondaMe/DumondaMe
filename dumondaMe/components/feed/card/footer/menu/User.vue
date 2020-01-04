<template>
    <div>
        <v-menu v-model="menu" :close-on-content-click="false" :nudge-width="280" min-width="290" offset-y
                :open-on-hover="!$vuetify.breakpoint.smAndDown" open-delay="700" offset-overflow
                :disabled="$vuetify.breakpoint.smAndDown && !user.isAnonymous">
            <template v-slot:activator="{ on }">
                <div v-on="on" @click="goToProfile">
                    <slot name="icon"></slot>
                </div>
            </template>
            <v-card class="ely-menu-container ely-menu-user" v-if="menu">
                <div class="menu-title">
                    <span class="primary-title" v-if="user.isAnonymous">{{$t('common:anonymousUser')}}</span>
                    <nuxt-link class="primary-link-title" :to="{name: 'dumondaMeOnTour-userId',
                params: {userId: user.userId}}" v-else-if="user.isHarvestingUser">{{user.name}}
                    </nuxt-link>
                    <nuxt-link class="primary-link-title" :to="{name: 'user-userId-slug',
                params: {userId: user.userId, slug: user.slug}}" v-else-if="!user.isLoggedInUser">{{user.name}}
                    </nuxt-link>
                    <nuxt-link class="primary-link-title" :to="{name: 'user'}" v-else>{{$t('common:you')}}</nuxt-link>
                    {{menuTitle}}
                </div>
                <div class="menu-content menu-user-content">
                    <div class="user-image" @click="goToProfile()"
                         :class="{'anonymous-image': user.isAnonymous, 'is-harvesting-user': user.isHarvestingUser}">
                        <v-tooltip bottom debounce="300" v-if="user.isTrustUser">
                            <template v-slot:activator="{ on }">
                                <v-icon v-on="on" class="trust-circle-icon">$vuetify.icons.mdiAccountCircle</v-icon>
                            </template>
                            <span>{{$t('common:inYourTrustCircle')}}</span>
                        </v-tooltip>
                        <img :src="user.userImagePreview">
                    </div>
                    <div class="anonymous-description" v-if="user.isAnonymous">
                        {{$t('common:anonymousUserDescription')}}
                    </div>
                </div>
                <v-divider></v-divider>
                <div class="menu-commands">
                    <v-spacer></v-spacer>
                    <div v-if="!user.isLoggedInUser && !user.isAnonymous && !user.isHarvestingUser">
                        <v-tooltip top v-if="user.isTrustUser">
                            <template v-slot:activator="{ on }">
                                <v-btn color="primary" class="user-action-button lower-action-button" v-on="on"
                                       :loading="loading" :disabled="loading || user.isLoggedInUser"
                                       @click="removeUserFromTrustCircle">
                                    <v-icon left>$vuetify.icons.mdiCheck</v-icon>
                                    {{$t('common:trustCircle')}}
                                </v-btn>
                            </template>
                            <span>{{$t('common:removeFromTrustCircle')}}</span>
                        </v-tooltip>
                        <v-tooltip top v-else>
                            <template v-slot:activator="{ on }">
                                <v-btn color="primary" class="user-action-button lower-action-button" v-on="on"
                                       :loading="loading" :disabled="loading || user.isLoggedInUser"
                                       @click="addUserToTrustCircle">
                                    <v-icon left>$vuetify.icons.mdiAccountPlus</v-icon>
                                    {{$t('common:trustCircle')}}
                                </v-btn>
                            </template>
                            <span>{{$t('common:addToTrustCircle')}}</span>
                        </v-tooltip>
                    </div>
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
    import LoginRequiredDialog from '~/components/common/dialog/LoginRequired';

    export default {
        props: ['menuTitle', 'user'],
        components: {LoginRequiredDialog},
        data() {
            return {menu: false, loading: false, showError: false, showLoginRequired: false}
        },
        methods: {
            goToProfile() {
                if (!this.user.isAnonymous) {
                    if (this.user.isHarvestingUser) {
                        this.$router.push({name: 'dumondaMeOnTour-userId', params: {userId: this.user.userId}})
                    } else if (this.user.isLoggedInUser) {
                        this.$router.push({name: 'user'});
                    } else {
                        this.$router.push({
                            name: 'user-userId-slug',
                            params: {userId: this.user.userId, slug: this.user.userSlug}
                        })
                    }
                }
            },
            async sendUserToTrustCircleCommand(command, emit) {
                if (this.$store.state.auth.userIsAuthenticated) {
                    try {
                        this.loading = true;
                        let response = await this.$axios[command](`user/trustCircle/${this.user.userId}`);
                        if (response && response.oneTimeNotificationCreated) {
                            this.$store.dispatch('notification/checkNotificationChanged');
                        }
                        this.$emit(emit, this.user.userId);
                    } catch (error) {
                        this.showError = true;
                    } finally {
                        this.loading = false;
                    }
                } else {
                    this.showLoginRequired = true;
                }
            },
            async addUserToTrustCircle() {
                await this.sendUserToTrustCircleCommand('$post', 'add-trust-circle');
            },
            async removeUserFromTrustCircle() {
                await this.sendUserToTrustCircleCommand('$delete', 'remove-trust-circle');
            }
        }
    }
</script>

<style lang="scss">
    .ely-menu-container.ely-menu-user {
        .menu-title {
            max-width: 320px;
        }

        .menu-user-content {
            display: flex;

            .user-image {
                position: relative;
                width: 148px;
                height: 148px;

                img {
                    cursor: pointer;
                    z-index: 0;
                    width: 100%;
                    height: 100%;
                    border-radius: 4px;
                }

                .trust-circle-icon {
                    position: absolute;
                    bottom: 0;
                    right: 0;
                    z-index: 2;
                    border-top-left-radius: 8px;
                    background-color: white;
                    color: $success-text;
                }
            }

            .user-image.is-harvesting-user {
                width: auto;
                height: auto;
                max-width: 280px;
            }

            .user-image.anonymous-image {
                width: 100px;
                height: 100px;


                img {
                    cursor: auto;
                }
            }

            .anonymous-description {
                margin-left: 12px;
                max-width: 200px;
            }
        }
    }
</style>