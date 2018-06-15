<template>
    <div class="notification-watch-commitment">
        <div class="notification-created">{{notification.created | formatRelativeTimesAgo}}</div>
        <div class="notification-description" v-html="$t('pages:notifications.watchingCommitment.notification',
            {count: notification.numberOfUsers, commitment})">
        </div>
        <div class="user-container">
            <div class="user" v-for="user in notification.users">
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
        </div>
        <div class="watched-command">
            <v-btn outline color="primary" @click="readNotificationEvent()"
                   :loading="requestWatchedRunning"
                   :disabled="requestWatchedRunning || notification.removed">
                {{$t('common:button.readNotification')}}
            </v-btn>
        </div>
    </div>
</template>

<script>
    export default {
        props: ['notification'],
        data() {
            return {requestWatchedRunning: false}
        },
        methods: {
            async readNotificationEvent() {
                this.requestWatchedRunning = true;
                await this.$store.dispatch('notification/notificationRead', this.notification);
                this.requestWatchedRunning = false;
            }
        },
        computed: {
            commitment() {
                return `<a class="commitment-title"
                           href="/commitment/${this.notification.commitmentId}/${this.notification.commitmentSlug}">
                        ${this.notification.commitmentTitle}</a>`
            }
        }
    }
</script>

<style lang="scss">
    .notification-watch-commitment {
        font-weight: 300;
        .notification-description {
            font-size: 16px;
        }
        .commitment-title {
            font-weight: 500;
            color: $primary-color;
            text-decoration: none;
        }
        :hover.commitment-title {
            text-decoration: underline;
        }
        .user-container {
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
        }
        .watched-command {
            margin-top: 12px;
            button {
                margin-left: 0;
            }
        }
    }
</style>