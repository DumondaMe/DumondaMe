<template>
    <div class="notification-added-to-trust-circle">
        <div class="notification-created">{{notification.created | formatRelativeTimesAgo}}</div>
        <div class="notification-description">
            {{$t('pages:notifications.addToTrustCircle.notification', {count: notification.numberOfAddedUsers})}}
        </div>
        <div class="user-container">
            <div class="user" v-for="user in notification.users">
                <div class="user-image">
                    <img :src="user.thumbnailUrl"/>
                </div>
                <div class="user-info">
                    <div class="user-name-container">
                        <span class="user-name">{{user.name}}</span>
                    </div>
                    <div class="created">
                        {{user.added | formatRelativeTimesAgo}}
                    </div>
                </div>
            </div>
        </div>
        <div class="watched-command">
            <v-btn outline color="primary" @click=""
                   :loading="requestWatchedRunning"
                   :disabled="requestWatchedRunning">
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
    }
</script>

<style lang="scss">
    .notification-added-to-trust-circle {
        font-weight: 300;
        .notification-description {
            font-size: 16px;
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