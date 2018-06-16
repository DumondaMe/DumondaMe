<template>
    <div class="notification-watched-command">
        <v-btn outline color="primary" @click="readNotificationEvent()"
               :loading="requestWatchedRunning"
               :disabled="requestWatchedRunning || notification.removed">
            {{$t('common:button.readNotification')}}
        </v-btn>
    </div>
</template>

<script>
    const ERROR_CODE_NOTIFICATION_NOT_EXISTING = 1;

    export default {
        props: ['notification'],
        data() {
            return {requestWatchedRunning: false}
        },
        methods: {
            async readNotificationEvent() {
                try {
                    this.requestWatchedRunning = true;
                    await this.$store.dispatch('notification/notificationRead', this.notification);
                } catch (error) {
                    if (error.response.data.errorCode === ERROR_CODE_NOTIFICATION_NOT_EXISTING) {
                        this.$store.commit('notification/REMOVE_NOTIFICATION', this.notification);
                    }
                } finally {
                    this.requestWatchedRunning = false;
                }
            }
        }
    }
</script>

<style lang="scss">
    .notification-watched-command {
        margin-top: 12px;
        button {
            margin-left: 0;
        }
    }
</style>