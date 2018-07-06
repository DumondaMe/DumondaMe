<template>
    <div id="elyoos-password-reset-request">
        <div id="password-reset-container" class="ely-card">
            <h2>{{$t("pages:passwordResetRequest.title")}}</h2>
            <div v-show="!successfullyReset">
                <v-form v-model="valid" ref="form" @keydown.enter.native="resetPasswordRequest()" @submit.prevent>
                    <p class="error-message" v-if="errorMessage">{{this.errorMessage}}</p>
                    <p>{{$t('pages:passwordResetRequest.description')}}</p>
                    <v-text-field type="text" v-model="formEmail"
                                  :label="$t('common:email')"
                                  :rules="[ruleFieldRequired($t('validation:fieldRequired')),
                                           ruleIsEmail($t('validation:isEmail')),
                                           ruleToManyChars($t('validation:toManyChars'), 255)]">
                    </v-text-field>
                    <v-btn color="primary" @click="resetPasswordRequest()"
                           :loading="loading" :disabled="loading || !valid">
                        {{$t("pages:passwordResetRequest.resetPasswordButton")}}
                    </v-btn>
                </v-form>
            </div>
            <div v-show="successfullyReset">
                <p>{{$t('pages:passwordResetRequest.sentDescription', {email: formEmail})}}</p>
                <v-btn color="primary" @click="$router.push({name: 'index'})">
                    {{$t("common:button.back")}}
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
                formEmail: null,
                errorMessage: null
            }
        },
        mixins: [validationRules],
        methods: {
            async resetPasswordRequest() {
                if (this.$refs.form.validate()) {
                    try {
                        this.errorMessage = null;
                        this.loading = true;
                        await this.$axios.$post(`login/password/requestReset`, {email: this.formEmail});
                        this.successfullyReset = true;
                    } catch (e) {
                        if (e.statusCode = 429) {
                            this.errorMessage = this.$t('pages:passwordResetRequest.errorToManyRequest')
                        }
                    } finally {
                        this.loading = false;
                    }
                }
            }
        }
    }
</script>

<style lang="scss">
    #elyoos-password-reset-request {
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
                margin-bottom: 24px;
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
