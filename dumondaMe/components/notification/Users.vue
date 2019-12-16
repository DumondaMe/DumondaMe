<template>
    <div class="notification-user-container">
        <div class="user" v-for="user in users">
            <div class="user-image" @click="navigateToUserProfile(user)">
                <img :src="user.thumbnailUrl"/>
            </div>
            <div class="user-info">
                <div class="user-name-container">
                    <span class="user-name" @click="navigateToUserProfile(user)"
                          v-if="!user.isAnonymous">{{user.name}} </span>
                    <v-tooltip bottom v-else>
                        <template v-slot:activator="{ on }">
                            <span class="user-name" v-on="on">
                            {{user.name}} </span>
                        </template>
                        <span>{{$t('pages:notifications.notAllowedToNavigateToPerson')}}</span>
                    </v-tooltip>
                </div>
                <div class="created">
                    {{user.added | formatRelativeTimesAgo}}
                </div>
            </div>
        </div>
        <div class="more-user-info" v-if="numberOfUsers > 3">
            {{$t('pages:notifications.moreUser',
            {count: numberOfUsers - users.length})}}
        </div>
    </div>
</template>

<script>
    export default {
        props: ['users', 'numberOfUsers'],
        methods: {
            navigateToUserProfile(user) {
                if (user.isAnonymous === false) {
                    this.$router.push({name: 'user-userId-slug', params: {userId: user.userId, slug: user.slug}});
                }
            }
        },
    }
</script>

<style lang="scss">
    .notification-user-container {
        .user {
            margin-top: 12px;
            display: flex;

            .user-image {
                cursor: pointer;
                height: 38px;
                width: 38px;
                flex-shrink: 0;

                img {
                    height: 100%;
                    width: 100%;
                    border-radius: 2px;
                }
            }

            .user-info {
                margin-left: 12px;
                height: 38px;

                .user-name-container {
                    font-weight: 400;
                    color: $primary-text;
                    font-size: 16px;
                    line-height: 16px;

                    .user-name {
                        cursor: pointer;
                    }

                    :hover.user-name {
                        text-decoration: underline;
                    }
                }

                .created {
                    font-size: 12px;
                    color: $secondary-text;
                    margin-top: 2px;
                }
            }
        }

        .more-user-info {
            font-size: 14px;
            margin-top: 12px;
        }
    }
</style>