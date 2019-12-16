<template>
    <div id="dumonda-me-login">
        <div id="login-container">
            <h2>{{$t("pages:login.titleLogin")}}</h2>
            <div id="login-content-container">
                <v-form @submit.prevent="login" v-model="valid" ref="form">
                    <p class="login-error" v-if="formError && !loading">{{$t('pages:login.invalidLoginData')}}</p>
                    <v-text-field type="text" v-model="formUsername" name="username" autocomplete="username"
                                  :label="$t('common:email')"
                                  :rules="[ruleFieldRequired($t('validation:fieldRequired')),
                                           ruleIsEmail($t('validation:isEmail')),
                                           ruleToManyChars($t('validation:toManyChars'), 255)]"
                                  class="input-group--focused">
                    </v-text-field>
                    <v-text-field type="password" v-model="formPassword" name="password" autocomplete="current-password"
                                  :label="$t('common:password')"
                                  :rules="[ruleFieldRequired($t('validation:fieldRequired')),
                                           ruleToManyChars($t('validation:toManyChars'), 55)]">
                    </v-text-field>
                    <v-btn color="primary" type="submit" id="login-button"
                           :loading="loading"
                           :disabled="loading || !valid">
                        {{$t("pages:login.loginButton")}}
                    </v-btn>
                </v-form>
                <nuxt-link class="password-reset" to="/login/passwordResetRequest">{{$t('pages:login.passwordReset')}}
                </nuxt-link>
            </div>
        </div>
    </div>
</template>

<script>
    import validationRules from '~/mixins/validationRules.js';

    export default {
        props: ['email', 'fromRoute'],
        data() {
            return {
                valid: false,
                formError: null,
                loading: false,
                formUsername: this.email,
                formPassword: ''
            }
        },
        mixins: [validationRules],
        methods: {
            async login() {
                this.loading = true;
                try {
                    await this.$store.dispatch('auth/login', {
                        username: this.formUsername,
                        password: this.formPassword
                    });
                    this.$store.dispatch('notification/startCheckNotificationChanged');
                    this.$store.commit('feedFilter/SET_SELECTED_FEED', 'activity');
                    this.$store.commit('feedFilter/SET_SORT_ORDER', 'newest');
                    let response = await this.$axios.$get('user/profile/image');
                    this.$store.commit('user/SET_USER_IMAGE', response.profileImage);
                    if (!this.fromRoute || this.fromRoute.name === null ||
                        this.fromRoute.name === 'login-passwordReset' || this.fromRoute.name === 'commitment' ||
                        this.fromRoute.name === 'event') {
                        this.$router.replace({name: 'index'});
                    } else {
                        this.$router.go(-1);
                    }
                } catch (e) {
                    this.loading = false;
                    this.formError = e.message;
                }
            }
        }
    }
</script>

<style lang="scss">
    #dumonda-me-login {
        padding: 16px;
        #login-container {
            width: 300px;
            margin: 24px auto 0 auto;

            @media screen and (min-width: $sm) {
                background-color: white;
                border-radius: 6px;
                border: 1px solid #e0e0e0;
                width: 320px;
                padding: 12px;
                margin: 0;
            }
            h2 {
                font-size: 24px;
                font-weight: 400;
            }
            #login-content-container {
                margin-top: 24px;
                .login-error {
                    color: #d84021;
                    border-left: 2px solid #d84021;
                    padding-left: 12px;
                }
                #login-button {
                    margin-left: 0;
                    margin-right: 0;
                    margin-bottom: 12px;
                    width: 100%;
                }
                .password-reset {
                    text-decoration: none;
                    font-size: 12px;
                }
                :hover.password-reset {
                    text-decoration: underline;
                }
            }
        }
    }
</style>
