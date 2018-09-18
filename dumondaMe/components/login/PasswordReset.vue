<template>
    <div id="dumonda-me-password-reset">
        <div id="password-reset-container" class="ely-card">
            <h2>{{$t("pages:passwordReset.title")}}</h2>
            <div v-show="!successfullyReset">
                <v-form v-model="valid" ref="form" @keydown.enter.native="resetPassword()" @submit.prevent>
                    <p class="error-message" v-if="errorMessage">{{this.errorMessage}}</p>
                    <v-text-field type="password" v-model="password" name="password"
                                  :label="$t('pages:passwordReset.newPassword')"
                                  :rules="[ruleMinLength($t('validation:minLength', {length: 8}), 8),
                                           rulePasswordChars($t('validation:noPasswordChars')),
                                           ruleToManyChars($t('validation:toManyChars'), 55)]"
                                  :counter="55">
                    </v-text-field>
                    <v-text-field type="password" v-model="passwordConfirm" name="passwordConfirm"
                                  :label="$t('pages:passwordReset.newPasswordConfirm')"
                                  :rules="[ruleFieldRequired($t('validation:fieldRequired')),
                                           rulePasswordEquals($t('validation:passwordNoEqual'), password),
                                           ruleToManyChars($t('validation:toManyChars'), 55)]"
                                  :counter="55">
                    </v-text-field>
                    <v-btn color="primary" @click="resetPassword()"
                           :loading="loading"
                           :disabled="loading || !valid || !!errorMessage || password !== passwordConfirm">
                        {{$t("common:button.change")}}
                    </v-btn>
                </v-form>
            </div>
            <div v-show="successfullyReset">
                <p>{{$t('pages:passwordReset.sentDescription')}}</p>
                <v-btn color="primary" @click="$router.push({name: 'login'})">
                    {{$t("common:button.login")}}
                </v-btn>
            </div>
        </div>
    </div>
</template>

<script>
    import validationRules from '~/mixins/validationRules.js';

    export default {
        data() {
            return {
                valid: false,
                loading: false,
                successfullyReset: false,
                password: null,
                passwordConfirm: null,
                errorMessage: null
            }
        },
        mixins: [validationRules],
        methods: {
            async resetPassword() {
                if (this.$refs.form.validate() && this.password === this.passwordConfirm) {
                    try {
                        this.errorMessage = null;
                        this.loading = true;
                        await this.$axios.$post(`login/password/reset`,
                            {linkId: this.$route.query.linkId, newPassword: this.password});
                        this.successfullyReset = true;
                    } catch (e) {
                        this.errorMessage = this.$t('pages:passwordReset.error')
                    } finally {
                        this.loading = false;
                    }
                }
            }
        }
    }
</script>

<style lang="scss">
    #dumonda-me-password-reset {
        #password-reset-container {
            width: 300px;

            @media screen and (min-width: $sm) {
                background-color: white;
                border-radius: 6px;
                border: 1px solid #e0e0e0;
                width: 320px;
                padding: 12px;
                margin: 0;
            }
            .error-message {
                color: #d84021;
                border-left: 2px solid #d84021;
                padding-left: 12px;
            }
            h2 {
                font-size: 24px;
                font-weight: 400;
                margin-bottom: 8px;
            }
            button {
                margin-left: 0;
            }
            p {
                font-weight: 300;
            }
        }
    }
</style>
