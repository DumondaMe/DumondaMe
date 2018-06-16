<template>
    <div class="notification-user-container">
        <div class="user" v-for="user in users">
            <div class="user-image" @click="$router.push({name: 'user-userId-slug',
                     params: {userId: user.userId, slug: user.slug}})">
                <img :src="user.thumbnailUrl"/>
            </div>
            <div class="user-info">
                <div class="user-name-container">
                        <span class="user-name" @click="$router.push({name: 'user-userId-slug',
                     params: {userId: user.userId, slug: user.slug}})">{{user.name}}</span>
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
        props: ['users', 'numberOfUsers']
    }
</script>

<style lang="scss">
    .notification-user-container {
        .user {
            margin-top: 12px;
            display: block;
            clear: both;
            .user-image {
                cursor: pointer;
                float: left;
                height: 38px;
                width: 38px;
                img {
                    height: 100%;
                    width: 100%;
                    border-radius: 50%;
                }
            }
            .user-info {
                margin-left: 52px;
                height: 38px;
                .user-name-container {
                    font-weight: 400;
                    color: $primary-color;
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