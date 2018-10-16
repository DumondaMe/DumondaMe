<template>
    <div id="dumonda-me-register">
        <h1>{{$t("pages:register.registerTitle")}}</h1>
        <div id="register-content-container">
            <v-form @submit.prevent="register" v-model="valid" ref="form" v-show="!successfullyRegistered">
                <v-layout row wrap>
                    <v-flex xs12>
                        <v-text-field type="text" v-model="formEmail" name="email"
                                      :label="$t('common:email')"
                                      :rules="[ruleFieldRequired($t('validation:fieldRequired')),
                                               ruleIsEmail($t('validation:isEmail')),
                                               ruleToManyChars($t('validation:toManyChars'), 255)]"
                                      :counter="255">
                        </v-text-field>
                    </v-flex>
                    <v-flex xs12 md5>
                        <v-text-field type="password" v-model="formPassword" name="password"
                                      :label="$t('common:password')"
                                      :rules="[ruleMinLength($t('validation:minLength', {length: 8}), 8),
                                               rulePasswordChars($t('validation:noPasswordChars')),
                                               ruleToManyChars($t('validation:toManyChars'), 55)]"
                                      :counter="55">
                        </v-text-field>
                    </v-flex>
                    <v-flex xs12 md5 offset-md2>
                        <v-text-field type="password" v-model="formPasswordConfirm" name="passwordConfirm"
                                      :label="$t('common:passwordConfirm')"
                                      :rules="[ruleFieldRequired($t('validation:fieldRequired')),
                                               rulePasswordEquals($t('validation:passwordNoEqual'), formPassword),
                                               ruleToManyChars($t('validation:toManyChars'), 55)]"
                                      :counter="55">
                        </v-text-field>
                    </v-flex>
                    <v-flex xs12 md5>
                        <v-text-field type="text" v-model="formForename" name="forename"
                                      :label="$t('common:forename')"
                                      :rules="[ruleFieldRequired($t('validation:fieldRequired')),
                                               ruleToManyChars($t('validation:toManyChars'), 40)]"
                                      :counter="40">
                        </v-text-field>
                    </v-flex>
                    <v-flex xs12 md5 offset-md2>
                        <v-text-field type="text" v-model="formSurname" name="surname"
                                      :label="$t('common:surname')"
                                      :rules="[ruleFieldRequired($t('validation:fieldRequired')),
                                               ruleToManyChars($t('validation:toManyChars'), 60)]"
                                      :counter="60">
                        </v-text-field>
                    </v-flex>
                    <v-flex xs12>
                        <v-checkbox v-model="acceptTerms" class="accept-terms" color="primary">
                            <span slot="label" @click="event => event.stopPropagation()">
                                {{$t('pages:register.acceptTerms')}}
                                <a href="/terms" target="_blank">{{$t('common:terms')}}</a>
                                {{$t('pages:register.acceptTerms2')}}
                                <a href="/privacy" target="_blank">{{$t('common:privacyPolicy')}}</a>
                            </span>
                        </v-checkbox>
                    </v-flex>
                </v-layout>
                <vue-recaptcha class="dumonda-me-recaptcha" :sitekey="siteKey"
                               @verify="setResponse">
                </vue-recaptcha>
                <p class="register-error" v-if="showErrorAccountExist">{{$t('pages:register.errorAccountExist')}}</p>
                <div id="register-commands">
                    <v-btn color="primary" type="submit" id="register-button"
                           :loading="loading"
                           :disabled="loading || !isValid">
                        {{$t("pages:register.registerButton")}}
                    </v-btn>
                </div>
            </v-form>
            <div v-show="successfullyRegistered" id="register-info">
                {{$t("pages:register.emailSentText", {email: formEmail})}}
                <div id="register-info-command">
                    <v-btn color="primary" @click="$router.push({name: 'index'})" class="register-button">
                        {{$t("common:button.ok")}}
                    </v-btn>
                </div>
            </div>
        </div>
        <v-snackbar top v-model="showError" color="error" :timeout="0">{{$t("common:error.unknown")}}
            <v-btn dark flat @click="showError = false">{{$t("common:button.close")}}</v-btn>
        </v-snackbar>
    </div>
</template>

<script>
    import VueRecaptcha from 'vue-recaptcha/dist/vue-recaptcha.min.js';
    import validationRules from '~/mixins/validationRules.js';

    const ERROR_ACCOUNT_EXISTS = 2;

    export default {
        components: {VueRecaptcha},
        data() {
            return {
                valid: false,
                loading: false,
                showError: false,
                showErrorAccountExist: false,
                successfullyRegistered: false,
                formEmail: '',
                formPassword: '',
                formPasswordConfirm: '',
                formForename: '',
                formSurname: '',
                acceptTerms: false,
                rcaptResponse: ''
            }
        },
        computed: {
            isValid() {
                return this.valid && this.acceptTerms && !!this.rcaptResponse;
            },
            siteKey() {
                return this.$store.state.recaptcha.siteKey
            }
        },
        mixins: [validationRules],
        methods: {
            setResponse(response) {
                this.rcaptResponse = response;
            },
            async register() {
                try {
                    this.loading = true;
                    this.showErrorAccountExist = false;
                    await this.$axios.$post('/register', {
                        language: this.$store.state.i18n.language,
                        forename: this.formForename,
                        surname: this.formSurname,
                        email: this.formEmail,
                        password: this.formPassword,
                        response: this.rcaptResponse,
                    });
                    this.successfullyRegistered = true;
                } catch (error) {
                    if (error.response.data.errorCode === ERROR_ACCOUNT_EXISTS) {
                        this.showErrorAccountExist = true;
                    } else {
                        this.showError = true;
                    }
                } finally {
                    this.loading = false;
                }
            }
        }
    }
</script>

<style lang="scss">
    #dumonda-me-register {
        max-width: 600px;
        background-color: white;
        border-radius: 6px;
        border: 1px solid #e0e0e0;
        padding: 16px;
        #register-content-container {
            margin-top: 24px;
            .register-error {
                color: #d84021;
                border-left: 2px solid #d84021;
                padding-left: 12px;
            }
            .accept-terms {
                margin-left: -4px;
                margin-top: 12px;
                margin-bottom: 12px;
                label {
                    text-overflow: unset;
                    white-space: unset;
                    overflow: unset;
                    width: auto;
                    min-width: 0;
                }
            }
            .dumonda-me-recaptcha {
                margin-top: 18px;
                margin-right: auto;
                margin-bottom: 36px;
            }
            #register-commands {
                display: flex;
                #register-button {
                    margin-left: auto;
                    margin-right: 0;
                }
            }
            #register-info {
                margin-top: 12px;
                #register-info-command {
                    margin-top: 12px;
                    display: flex;
                    button {
                        margin-left: auto;
                        margin-right: 0;
                    }
                }
            }
        }
    }
</style>
