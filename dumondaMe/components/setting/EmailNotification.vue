<template>
    <div class="email-notification-setting-container">
        <div id="top-checkbox">
            <v-checkbox v-model="enabledEmailNotifications"
                        :label="$t('pages:settings.emailNotification.emailNotifications')"
                        color="primary" :disabled="loading">
            </v-checkbox>
        </div>
        <v-divider class="email-notification-divider"></v-divider>
        <div v-if="enabledEmailNotifications" id="sub-checkboxes">
            <v-checkbox v-model="enableInviteToAnswerQuestion"
                        :label="$t('pages:settings.emailNotification.inviteToAnswerQuestion')"
                        color="primary" :disabled="loading || !enabledEmailNotifications">
            </v-checkbox>
            <v-checkbox v-model="enableNewNotifications"
                        :label="$t('pages:settings.emailNotification.newNotifications')"
                        color="primary" :disabled="loading || !enabledEmailNotifications">
            </v-checkbox>
        </div>
        <div v-else class="email-disabled-description">
            {{$t('pages:settings.emailNotification.disabledDescription')}}
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                enabledEmailNotifications: this.$store.state.setting.emailNotifications.enabledEmailNotifications,
                enableInviteToAnswerQuestion: this.$store.state.setting.emailNotifications.enableInviteToAnswerQuestion,
                enableNewNotifications: this.$store.state.setting.emailNotifications.enableNewNotifications,
                loading: false, previouslyEnabledEmailNotifications: false
            }
        },
        mounted() {
            this.disableAllNotifications();
        },
        methods: {
            async setEmailNotifications(enableEmailNotifications, enableInviteToAnswerQuestion, enableNewNotifications) {
                try {
                    this.loading = true;
                    this.previouslyEnabledEmailNotifications = false;
                    await this.$store.dispatch('setting/setEmailNotification', {
                        enableEmailNotifications, enableInviteToAnswerQuestion, enableNewNotifications
                    });
                } finally {
                    this.loading = false;
                }
            },
            disableAllNotifications() {
                if (!this.enableInviteToAnswerQuestion && !this.enableNewNotifications) {
                    this.enabledEmailNotifications = false;
                    return true;
                }
                return false;
            }
        },
        watch: {
            async enabledEmailNotifications() {
                await this.setEmailNotifications(this.enabledEmailNotifications, this.enabledEmailNotifications,
                    this.enabledEmailNotifications);
                if (this.enabledEmailNotifications) {
                    this.previouslyEnabledEmailNotifications = true;
                    this.enableInviteToAnswerQuestion = true;
                    this.enableNewNotifications = true;
                }
            },
            async enableInviteToAnswerQuestion() {
                if ((!this.previouslyEnabledEmailNotifications || !this.enableInviteToAnswerQuestion) &&
                    !this.disableAllNotifications()) {
                    await this.setEmailNotifications(this.enabledEmailNotifications, this.enableInviteToAnswerQuestion,
                        this.enableNewNotifications);
                }
            },
            async enableNewNotifications() {
                if ((!this.previouslyEnabledEmailNotifications || !this.enableNewNotifications) &&
                    !this.disableAllNotifications()) {
                    await this.setEmailNotifications(this.enabledEmailNotifications, this.enableInviteToAnswerQuestion,
                        this.enableNewNotifications);
                }
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

        #sub-checkboxes {
            .v-input {
                margin-top: 0;

                .v-input__slot {
                    margin-bottom: 4px;
                }
            }
        }

        .email-notification-divider {
            margin-bottom: 32px;
        }

        .email-disabled-description {
            font-weight: 300;
        }
    }
</style>
