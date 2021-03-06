<template>
    <div class="user-list-info">
        <div class="image-container" @click="$router.push({name: 'user-userId-slug',
                     params: {userId: user.userId, slug: user.slug}})">
            <img :src="user.profileUrl">
        </div>
        <div class="user-info-container" v-if="!user.isAnonymous">
            <div class="user-name"
                 @click="$router.push({name: 'user-userId-slug',
                     params: {userId: user.userId, slug: user.slug}})">{{user.name}}
            </div>
            <div class="user-info" v-if="isAuthenticated">
                <v-tooltip bottom debounce="1500" v-if="!user.isLoggedInUser">
                    <template v-slot:activator="{ on }">
                        <v-icon :class="{'out-of-trust-circle': !user.isPersonOfTrust,
                        'in-trust-circle': user.isPersonOfTrust}" v-on="on" size="19">
                            $vuetify.icons.mdiAccountCircle
                        </v-icon>
                    </template>
                    <span v-if="user.isPersonOfTrust">{{$t("pages:detailUser.trustCircle.inYourCircle")}}</span>
                    <span v-else>{{$t("pages:detailUser.trustCircle.notInYourCircle")}}</span>
                </v-tooltip>
                <span v-if="isLoggedInUser && user.personOfTrustSince && !showDateRelative">
                        {{$t("pages:detailUser.trustCircle.since", {date: getDate(user.personOfTrustSince)})}}</span>
                <span v-else-if="showDateRelative && user.date"> {{user.date | formatRelativeTimesAgo}}</span>
            </div>
        </div>
        <div class="user-info-container" v-else>
            <div class="user-name-anonymous">{{$t('common:anonymousUser', {count: user.numberOfAnonymous})}}</div>
        </div>
        <div class="user-settings-menu" v-if="isAuthenticated && !user.isLoggedInUser && !user.isAnonymous">
            <v-menu bottom left>
                <template v-slot:activator="{ on }">
                    <v-btn icon v-on="on">
                        <v-icon>$vuetify.icons.mdiDotsVertical</v-icon>
                    </v-btn>
                </template>
                <v-list>
                    <v-list-item v-if="user.isPersonOfTrust"
                                 @click="$emit('remove-from-trust-circle',(user.userId))">
                        <v-list-item-title>{{$t("pages:detailUser.trustCircle.removeFromYourCircle")}}
                        </v-list-item-title>
                    </v-list-item>
                    <v-list-item v-else @click="$emit('add-to-trust-circle',(user.userId))">
                        <v-list-item-title>{{$t("pages:detailUser.trustCircle.addToYourCircle")}}
                        </v-list-item-title>
                    </v-list-item>
                    <v-list-item @click="">
                        <v-list-item-title>{{$t("pages:detailUser.trustCircle.blockUser")}}</v-list-item-title>
                    </v-list-item>
                </v-list>
            </v-menu>
        </div>
    </div>
</template>

<script>
    export default {
        props: ['user', 'showDateRelative'],
        computed: {
            isAuthenticated() {
                return this.$store.state.auth.userIsAuthenticated
            },
            isLoggedInUser() {
                return this.$store.state.userProfile.user.isLoggedInUser;
            }
        },
        methods: {
            getDate(date) {
                return this.$options.filters.formatDateOnly(date);
            },
            addUserToTrustCircle(userId) {
                this.$store.dispatch('userProfile/addUserToTrustCircle', userId);
            },
            removeUserFromTrustCircle(userId) {
                this.$store.dispatch(`userProfile/removeUserFromTrustCircle`, userId);
            }
        }
    }
</script>

<style lang="scss">
    .user-list-info {
        width: 100%;
        display: flex;
        margin-bottom: 8px;

        .image-container {
            height: 36px;
            width: 36px;
            margin-top: 4px;
            margin-right: 12px;
            cursor: pointer;

            img {
                width: 100%;
                height: 100%;
                border-radius: 50%;
            }
        }

        .user-info-container {
            flex-grow: 1;

            .user-name {
                display: inline-block;
                font-size: 14px;
                cursor: pointer;
            }

            .user-name-anonymous {
                font-size: 14px;
            }

            :hover.user-name {
                text-decoration: underline;
            }

            .user-info {
                font-size: 12px;
                color: $secondary-text;

                i {
                    display: inline-block;
                    color: $success-text;
                    font-size: 19px;
                    height: 19px;
                    width: 19px;
                    vertical-align: inherit;
                    cursor: pointer;
                }

                span {
                    vertical-align: top;
                    line-height: 19px;
                }

                .in-trust-circle {
                    color: $success-text;
                }

                .out-of-trust-circle {
                    color: $secondary-text;
                }
            }
        }

        .user-settings-menu {

            button {
                margin-right: 0;

                i.v-icon {
                    color: #666666;
                }
            }
        }
    }
</style>
