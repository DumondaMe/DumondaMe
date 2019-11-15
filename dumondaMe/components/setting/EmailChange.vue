<template>
    <div class="change-email-container">
        <div class="security-sub-title">{{$t('pages:settings.email.change.title')}}</div>
        <div class="user-email-address">{{email.email}}</div>
        <!--<v-form v-model="validNewEmail" ref="changeEmail">
            <div class="warning-other-user-with-email" v-if="otherUserWithEmail">
                {{this.$t('pages:settings.email.change.otherUserWithEmailExists', {email: otherUserWithEmail})}}
            </div>
            <div class="show-email-changed" v-if="newEmailRequestSent">

            </div>
            <v-text-field v-model="newEmail"
                          :label="$t('pages:settings.email.change.newEmailLabel')"
                          :rules="[ruleTextIsNotEqual($t('pages:settings.email.change.alreadyUsingEmail'), email.email),
                                   ruleIsEmail($t('validation:isEmail')),
                                   ruleToManyChars($t('validation:toManyChars'), 255)]">
            </v-text-field>
        </v-form>
        <v-btn color="primary" class="change-email-button" :loading="uploadIsRunning"
               :disabled="!validNewEmail || (newEmail && newEmail.trim() === '')"
               @click="changeEmailRequest">
            {{$t('pages:settings.email.change.button')}}
        </v-btn>-->
        <v-snackbar top v-model="showError" color="error" :timeout="0">{{$t("common:error.unknown")}}
            <v-btn dark text @click="showError = false">{{$t("common:button.close")}}</v-btn>
        </v-snackbar>
    </div>
</template>

<script>
    import validationRules from '~/mixins/validationRules.js';

    const ERROR_CODE_EMAIL_ALREADY_EXISTING = 1;

    export default {
        data() {
            return {
                newEmail: '', validNewEmail: false, newEmailRequestSent: false, showError: false,
                uploadIsRunning: false, otherUserWithEmail: null
            };
        },
        computed: {
            email() {
                return this.$store.state.setting.email;
            }
        },
        mixins: [validationRules],
        methods: {
            async changeEmailRequest() {
                try {
                    this.uploadIsRunning = true;
                    this.otherUserWithEmail = null;
                    await this.$store.dispatch('setting/newEmailRequest', this.newEmail);
                    this.$refs.changeEmail.reset();
                    this.newEmailRequestSent = true;
                } catch (error) {
                    if (error.response.data.errorCode === ERROR_CODE_EMAIL_ALREADY_EXISTING) {
                        this.otherUserWithEmail = this.newEmail;
                    } else {
                        this.showError = true;
                    }
                } finally {
                    this.uploadIsRunning = false;
                }
            }
        }
    }
</script>

<style lang="scss">
    .change-email-container {
        margin-bottom: 42px;

        .user-email-address {
            font-weight: 300;
        }

        .show-email-changed {
            color: $success-text;
            border-left: 2px solid $success-text;
            padding-left: 12px;
        }

        .warning-other-user-with-email {
            margin: 12px 0;
            color: $warning;
            border-left: 2px solid $warning;
            padding-left: 12px;
        }

        .change-email-button {
            margin-top: 4px;
        }
    }
</style>
