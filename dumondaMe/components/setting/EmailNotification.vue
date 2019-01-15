<template>
    <div class="email-notification-setting-container">
        <div id="top-checkbox">
            <v-checkbox v-model="enabledEmailNotifications"
                        :label="$t('pages:settings.emailNotification.emailNotifications')"
                        color="secondary" :disabled="loading">
            </v-checkbox>
        </div>
        <v-divider class="email-notification-divider"></v-divider>
        <v-checkbox v-model="enableInviteToAnswerQuestion"
                    :label="$t('pages:settings.emailNotification.inviteToAnswerQuestion')"
                    color="primary" :disabled="loading || !enabledEmailNotifications">
        </v-checkbox>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                enabledEmailNotifications: this.$store.state.setting.emailNotifications.enabledEmailNotifications,
                enableInviteToAnswerQuestion: this.$store.state.setting.emailNotifications.enableInviteToAnswerQuestion,
                loading: false
            }
        },
        methods: {
            async setEmailNotifications() {
                try {
                    this.loading = true;
                    await this.$store.dispatch('setting/setEmailNotification', {
                        enableEmailNotifications: this.enabledEmailNotifications,
                        enableInviteToAnswerQuestion: this.enableInviteToAnswerQuestion
                    });
                } finally {
                    this.loading = false;
                }
            }
        },
        watch: {
            async enabledEmailNotifications() {
                await this.setEmailNotifications();
            },
            async enableInviteToAnswerQuestion() {
                await this.setEmailNotifications();
            }
        }
    }
</script>

<style lang="scss">
    .email-notification-setting-container {
        #top-checkbox {
            .v-input {
                margin-top: 0;

                .v-input__slot {
                    margin-bottom: 4px;
                }
            }
        }

        .email-notification-divider {
            margin-bottom: 24px;
        }
    }
</style>
