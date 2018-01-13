<template>
    <div id="elyoos-register">
        <h1>{{$t("pages:register.registerTitle")}}</h1>
        <div id="register-content-container">
            <form @submit.prevent="register">
                <v-layout row wrap>
                    <v-flex xs12>
                        <v-text-field type="text" v-model="formEmail" name="email"
                                      :label="$t('common:email')"
                                      v-validate="'required|max:255'" :counter="255">
                        </v-text-field>
                    </v-flex>
                    <v-flex xs12 md5>
                        <v-text-field type="password" v-model="formPassword" name="password"
                                      :label="$t('common:password')"
                                      v-validate="'required|max:55'" :counter="55">
                        </v-text-field>
                    </v-flex>
                    <v-flex xs12 md5 offset-md2>
                        <v-text-field type="password" v-model="formPasswordConfirm" name="passwordConfirm"
                                      :label="$t('common:passwordConfirm')"
                                      v-validate="'required|max:55'" :counter="55">
                        </v-text-field>
                    </v-flex>
                    <v-flex xs12 md5>
                        <v-text-field type="text" v-model="formForename" name="forename"
                                      :label="$t('common:forename')"
                                      v-validate="'required|max:40'" :counter="40">
                        </v-text-field>
                    </v-flex>
                    <v-flex xs12 md5 offset-md2>
                        <v-text-field type="text" v-model="formSurname" name="surname"
                                      :label="$t('common:surname')"
                                      v-validate="'required|max:60'" :counter="60">
                        </v-text-field>
                    </v-flex>
                    <v-flex xs12>
                        <v-checkbox v-model="acceptTerms" class="accept-terms" color="primary">
                            <span slot="label" @click="event => event.stopPropagation()">
                                {{$t('pages:register.acceptTermsPrevious')}}
                                <a href="/terms" target="_blank">{{$t('common:terms')}}</a></span>
                        </v-checkbox>
                    </v-flex>
                </v-layout>
                <recaptcha class="elyoos-recaptcha" @response="setResponse"></recaptcha>
                <div id="register-commands">
                    <v-btn color="primary" type="submit" id="register-button"
                           :loading="loading"
                           :disabled="loading">
                        {{$t("pages:register.registerButton")}}
                    </v-btn>
                </div>
            </form>
        </div>
    </div>
</template>

<script>
    import Recaptcha from '~/components/common/recaptcha/Recaptcha.vue';

    export default {
        components: {Recaptcha},
        data() {
            return {
                formError: null,
                loading: false,
                formEmail: '',
                formPassword: '',
                formPasswordConfirm: '',
                formForename: '',
                formSurname: '',
                acceptTerms: false,
                rcaptResponse: '',
                rcaptSigKey: '6LfWvyYTAAAAADB8n5MjlwL2V23ZRKCJY3wUbixJ'
            }
        },
        computed: {
            isValid() {
                return null;
            }
        },
        methods: {
            setResponse(response) {
                this.rcaptResponse = response;
            },
            async register() {
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
    #elyoos-register {
        max-width: 600px;
        background-color: white;
        border-radius: 6px;
        border: 1px solid #e0e0e0;
        padding: 16px;
        #register-content-container {
            margin-top: 24px;
            .accept-terms {
                margin-left: -4px;
                label {
                    width: auto;
                    min-width: 0;
                }
            }
            .elyoos-recaptcha {
                margin-right: auto;
                margin-bottom: 36px;
            }
            #register-commands {
                height: 40px;
                #register-button {
                    float: right;
                    margin-right: 0;
                }
            }
        }
    }
</style>
