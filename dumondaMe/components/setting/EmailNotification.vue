<template>
    <div class="email-notification-setting-container">
        <div class="security-sub-title">{{$t('pages:settings.email.emailNotification.title')}}</div>
        <div id="top-checkbox">
            <div class="notification-description">{{$t('pages:settings.email.emailNotification.description')}}</div>
            <v-radio-group v-model="emailNotificationInterval" column id="select-interval-container"
                           @change="setEmailNotificationInterval" :loading="loading">
                <v-radio :label="$t('pages:settings.email.emailNotification.never')"
                         value="never" color="primary">
                </v-radio>
                <v-radio :label="$t('pages:settings.email.emailNotification.hour')"
                         value="hour" color="primary">
                </v-radio>
                <v-radio :label="$t('pages:settings.email.emailNotification.day')"
                         value="day" color="primary">
                </v-radio>
                <v-radio :label="$t('pages:settings.email.emailNotification.3days')"
                         value="3days" color="primary">
                </v-radio>
                <v-radio :label="$t('pages:settings.email.emailNotification.week')"
                         value="week" color="primary">
                </v-radio>
            </v-radio-group>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                emailNotificationInterval: this.$store.state.setting.emailNotificationInterval, loading: false
            }
        },
        methods: {
            async setEmailNotificationInterval() {
                try {
                    this.loading = true;
                    await this.$store.dispatch('setting/setEmailNotification', this.emailNotificationInterval);
                } finally {
                    this.loading = false;
                }
            }
        }
    }
</script>

<style lang="scss">
    .email-notification-setting-container {
        #top-checkbox {
            .notification-description {
                font-weight: 300;
            }
        }
    }
</style>
