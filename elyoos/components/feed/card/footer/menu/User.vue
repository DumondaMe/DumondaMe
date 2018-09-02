<template>
    <v-menu v-model="menu" :close-on-content-click="false" :nudge-width="280" offset-y>
        <slot name="icon" slot="activator"></slot>
        <v-card class="ely-menu-container">
            <div class="menu-title"><span class="primary-title" v-if="!isLoggedInUser">{{userName}}</span>
                <span class="primary-title" v-else>{{$t('common:you')}}</span> {{menuTitle}}
            </div>
            <div class="menu-content menu-user-content">
                <div class="user-image">
                    <v-tooltip bottom debounce="300" class="trust-circle-icon" v-if="isTrustUser">
                        <v-icon slot="activator">mdi-account-circle</v-icon>
                        <span>{{$t('common:inYourTrustCircle')}}</span>
                    </v-tooltip>
                    <img :src="userImage">
                </div>
                <div class="user-infos">
                    <div>
                        <v-btn outline color="primary" class="user-action-button top-action-button"
                               @click="goToProfile()">
                            {{$t('common:profile')}}
                        </v-btn>
                    </div>
                    <div v-if="!isLoggedInUser">
                        <v-btn outline color="primary" class="user-action-button lower-action-button"
                               v-if="isTrustUser">
                            <v-icon left>mdi-check</v-icon>
                            {{$t('common:trustCircle')}}
                        </v-btn>
                        <v-btn outline color="primary" class="user-action-button lower-action-button" v-else>
                            <v-icon left>mdi-account-plus</v-icon>
                            {{$t('common:trustCircle')}}
                        </v-btn>
                    </div>
                </div>
            </div>
            <v-divider></v-divider>
            <div class="menu-commands">
                <v-spacer></v-spacer>
                <v-btn flat color="primary" @click="menu = false">{{$t('common:button.close')}}</v-btn>
            </div>
        </v-card>
    </v-menu>
</template>

<script>
    export default {
        props: ['menuTitle', 'user', 'userImage', 'userName', 'userId', 'userSlug', 'isTrustUser', 'isLoggedInUser'],
        data() {
            return {menu: false}
        },
        methods: {
            goToProfile() {
                if (this.isLoggedInUser) {
                    this.$router.push({name: 'user'});
                } else {
                    this.$router.push({name: 'user-userId-slug', params: {userId: this.userId, slug: this.userSlug}})
                }
            }
        }
    }
</script>

<style lang="scss">
    .ely-menu-container {
        .menu-user-content {
            display: flex;
            .user-image {
                position: relative;
                width: 100px;
                height: 100px;
                img {
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
                    i {
                        color: $success-text;
                    }
                }
            }
            .user-infos {
                position: relative;
                height: 90px;
                flex-grow: 1;
                div {
                    .user-action-button {
                        position: absolute;
                        margin-top: 0;
                        margin-right: 0;
                        margin-bottom: 0;
                    }
                    .top-action-button {
                        top: 0;
                        right: 0;
                    }
                    .lower-action-button {
                        bottom: 0;
                        right: 0;
                    }
                }
            }
        }
    }
</style>