<template>
    <div id="elyoos-login">
        <div id="login-container">
            <h2>{{$t("pages:login.titleLogin")}}</h2>
            <div id="login-content-container">
                <form @submit.prevent="login">
                    <p class="error" v-if="formError">{{ formError }}</p>
                    <v-text-field type="text" v-model="formUsername" name="username"
                                  :label="$t('common:email')"
                                  class="input-group--focused">
                    </v-text-field>
                    <v-text-field type="password" v-model="formPassword" name="password"
                                  :label="$t('common:password')">
                    </v-text-field>
                    <v-btn color="primary" type="submit" id="login-button"
                           :loading="loading"
                           :disabled="loading">
                        {{$t("pages:login.loginButton")}}
                    </v-btn>
                </form>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                formError: null,
                loading: false,
                formUsername: '',
                formPassword: ''
            }
        },
        methods: {
            async login() {
                this.loading = true;
                try {
                    await this.$store.dispatch('auth/login', {
                        username: this.formUsername,
                        password: this.formPassword
                    });
                    this.$router.push({name: 'index'});
                } catch (e) {
                    this.loading = false;
                    this.formError = e.message;
                }
            }
        }
    }
</script>

<style lang="scss">
    #elyoos-login {
        #login-container {
            width: 300px;
            margin: 0 auto;

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
                #login-button {
                    margin-left: 0;
                    margin-right: 0;
                    width: 100%;
                }
            }
        }
    }
</style>
