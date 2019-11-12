<template>
    <div class="security-setting-container">
        <div class="security-title">{{$t('pages:settings.security.changePasswordTitle')}}</div>
        <v-form v-model="valid" ref="formChangePassword" class="new-password-container">
            <v-text-field type="password" v-model="oldPassword"
                          :label="$t('pages:settings.security.oldPassword')"
                          :rules="[ruleFieldRequired($t('validation:fieldRequired'))]"
                          :counter="55">
            </v-text-field>
            <v-text-field type="password" v-model="newPassword"
                          :label="$t('common:password')"
                          :rules="[ruleMinLength($t('validation:minLength', {length: 8}), 8),
                               rulePasswordChars($t('validation:noPasswordChars')),
                               ruleToManyChars($t('validation:toManyChars'), 55)]"
                          :counter="55">
            </v-text-field>
            <v-text-field type="password" v-model="newPasswordConfirm"
                          :label="$t('common:passwordConfirm')"
                          :rules="[ruleFieldRequired($t('validation:fieldRequired')),
                               rulePasswordEquals($t('validation:passwordNoEqual'), newPassword),
                               ruleToManyChars($t('validation:toManyChars'), 55)]"
                          :counter="55">
            </v-text-field>
            <div class="password-changed-successfully" v-show="showChangedPassword">
                {{$t('pages:settings.security.changedPasswordSuccessfully')}}
            </div>
            <v-btn color="primary" class="change-password-button" :disabled="!valid || loading" :loading="loading"
                   @click="changePassword()">
                {{$t('pages:settings.security.changePasswordButton')}}
            </v-btn>
        </v-form>
    </div>
</template>

<script>
    import validationRules from '~/mixins/validationRules.js';

    export default {
        data() {
            return {
                loading: false, newPassword: '', newPasswordConfirm: '', oldPassword: '', valid: false,
                showChangedPassword: false
            }
        },
        mixins: [validationRules],
        methods: {
            async changePassword() {
                try {
                    this.loading = true;
                    await this.$axios.$post(`user/password`,
                        {actualPassword: this.oldPassword, newPassword: this.newPassword});
                    this.oldPassword = '';
                    this.newPassword = '';
                    this.newPasswordConfirm = '';
                    this.$refs.formChangePassword.reset();
                    this.showChangedPassword = true;
                } catch (error) {

                } finally {
                    this.loading = false;
                }
            },
            setShowChangedPassword(newValue) {
                if (newValue !== '' && newValue) {
                    this.showChangedPassword = false;
                }
            }
        },
        watch: {
            newPassword(newValue) {
                this.setShowChangedPassword(newValue);
            },
            newPasswordConfirm(newValue) {
                this.setShowChangedPassword(newValue);
            },
            oldPassword(newValue) {
                this.setShowChangedPassword(newValue);
            }
        }
    }
</script>

<style lang="scss">
    .security-setting-container {
        .security-title {
            font-weight: 500;
            font-size: 18px;
        }

        .new-password-container {
            margin-top: 16px;
            max-width: 300px;
        }

        .change-password-button {
            margin-left: 0;
            margin-top: 18px;
        }

        .password-changed-successfully {
            color: $success-text;
            border-left: 2px solid $success-text;
            padding-left: 12px;
            margin-top: 12px;
        }
    }
</style>
