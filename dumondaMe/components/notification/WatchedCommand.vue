<template>
    <div class="notification-watched-command">
        <v-btn color="primary" @click="readNotificationEvent()" v-if="!notification.read"
               :disabled="requestWatchedRunning" :loading="requestWatchedRunning">
            {{$t('pages:notifications.buttonRead')}}
        </v-btn>
        <slot name="additionalCommands">
        </slot>
        <v-snackbar top v-model="showError" color="error" :timeout="0">{{$t("common:error.unknown")}}
            <v-btn dark text @click="showError = false">{{$t("common:button.close")}}</v-btn>
        </v-snackbar>
    </div>
</template>

<script>
    const ERROR_CODE_NOTIFICATION_NOT_EXISTING = 1;

    export default {
        props: ['notification'],
        data() {
            return {requestWatchedRunning: false, showError: false}
        },
        methods: {
            async readNotificationEvent() {
                try {
                    this.requestWatchedRunning = true;
                    await this.$store.dispatch('notification/notificationRead', this.notification);
                } catch (error) {
                    if (error.response.data.errorCode === ERROR_CODE_NOTIFICATION_NOT_EXISTING) {
                        this.$store.commit('notification/REMOVE_NOTIFICATION', this.notification);
                    } else {
                        this.showError = true;
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
        margin-top: 18px;
        display: flex;

        button {
            margin-left: 0;
        }
    }
</style>