<template>
    <div class="notification-watched-command">
        <v-tooltip bottom max-width="250px">
            <v-btn color="primary" @click="readNotificationEvent()" slot="activator"
                   :loading="requestWatchedRunning" :disabled="requestWatchedRunning || notification.removed">
                {{$t('common:button.delete')}}
            </v-btn>
            <span v-if="!notification.removed">{{$t('pages:notifications.toolbar.notMarkedAsRead')}}</span>
            <span v-else>{{$t('pages:notifications.toolbar.markedAsRead')}}</span>
        </v-tooltip>
        <v-snackbar top v-model="showError" color="error" :timeout="0">{{$t("common:error.unknown")}}
            <v-btn dark flat @click="showError = false">{{$t("common:button.close")}}</v-btn>
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
        margin-top: 12px;
        button {
            margin-left: 0;
        }
    }
</style>