<template>
    <v-card class="import-basic-auth">
        <div id="dumonda-me-dialog-header">
            {{dialogTitle}}
        </div>
        <v-divider></v-divider>
        <v-card-text class="mobile-dialog-content">
            <v-form class="inner-container-basic-auth" v-model="valid">
                <v-text-field type="text" v-model="username" name="username"
                              :label="labelEmail"
                              :rules="[ruleFieldRequired($t('validation:fieldRequired')),
                                       ruleIsEmail($t('validation:isEmail')),
                                       ruleToManyChars($t('validation:toManyChars'), 255)]">
                </v-text-field>
                <v-text-field type="password" v-model="password" name="password"
                              :label="$t('common:password')"
                              :rules="[ruleFieldRequired($t('validation:fieldRequired')),
                                       ruleToManyChars($t('validation:toManyChars'), 255)]">
                </v-text-field>
                <p class="login-error" v-if="formError && !loading">{{$t('pages:login.invalidLoginData')}}</p>
                <div class="info-privacy">
                    {{$t('dialog:invite.basicAuth.info')}}
                </div>
            </v-form>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" flat @click.native="$emit('close')">
                {{$t("common:button.back")}}
            </v-btn>
            <v-btn color="primary" :loading="loading" :disabled="loading || !valid" @click="getContacts">
                {{$t("common:button.import")}}
            </v-btn>
        </v-card-actions>
    </v-card>
</template>

<script>
    import validationRules from '~/mixins/validationRules.js';

    export default {
        props: ['labelEmail', 'dialogTitle', 'importUrl', 'sourceDescription'],
        data() {
            return {valid: false, username: '', password: '', loading: false, formError: false}
        },
        mixins: [validationRules],
        methods: {
            async getContacts() {
                try {
                    this.loading = true;
                    let response = await this.$axios.$put(this.importUrl,
                        {username: this.username, password: this.password});
                    this.addSourceToContacts(response.contacts, this.sourceDescription);
                    this.$emit('contacts-loaded', response.contacts);
                } catch (error) {

                } finally {
                    this.loading = false;
                }
            },
            addSourceToContacts(contacts, source) {
                for (let contact of contacts) {
                    contact.source = source;
                }
            }
        }
    }
</script>

<style lang="scss">
    .import-basic-auth {
        .inner-container-basic-auth {
            max-width: 400px;
            margin: 0 auto;

            .info-privacy {
                margin-top: 18px;
            }
        }
    }
</style>
