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