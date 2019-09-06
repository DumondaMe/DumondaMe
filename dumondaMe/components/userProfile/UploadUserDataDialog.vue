<template>
    <v-layout row justify-center>
        <v-dialog v-model="dialog" scrollable persistent max-width="500px" :fullscreen="$vuetify.breakpoint.xsOnly">
            <v-card id="dialog-upload-user-data">
                <v-card-title>
                    {{$t("pages:detailUser.profileData.changeProfileDataTitle")}}
                </v-card-title>
                <v-divider></v-divider>
                <v-card-text id="dialog-upload-user-data-content" class="mobile-dialog-content">
                    <v-form v-model="valid">
                        <v-layout row wrap>
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
                                <v-textarea type="text" v-model="formUserDescription" name="userDescription"
                                            class="user-description"
                                              :label="$t('pages:detailUser.profileData.userDescription')"
                                              :rules="[ruleToManyChars($t('validation:toManyChars'), 3000)]"
                                              :counter="3000" auto-grow>
                                </v-textarea>
                            </v-flex>
                        </v-layout>
                    </v-form>
                </v-card-text>
                <v-divider></v-divider>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="primary" text @click="$emit('close-dialog')">
                        {{$t("common:button.abort")}}
                    </v-btn>
                    <v-btn color="primary" @click.native="uploadUserData()" ref="submitButton"
                           :disabled="hasChanged || !valid || uploadRunning"
                           :loading="uploadRunning">
                        {{$t("common:button.change")}}
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <v-snackbar top v-model="showError" color="error" :timeout="0">{{$t("common:error.unknown")}}
            <v-btn dark text @click="showError = false">{{$t("common:button.close")}}</v-btn>
        </v-snackbar>
    </v-layout>
</template>

<script>
    import validationRules from '~/mixins/validationRules.js';

    export default {
        props: ['forename', 'surname', 'userDescription'],
        data() {
            return {
                dialog: true, valid: false, uploadRunning: false,
                formForename: this.$store.state.userProfile.user.forename,
                formSurname: this.$store.state.userProfile.user.surname,
                formUserDescription: this.$store.state.userProfile.user.userDescription,
                showError: false
            }
        },
        computed: {
            user() {
                return this.$store.state.userProfile.user;
            },
            hasChanged() {
                return this.user.forename === this.formForename && this.user.surname === this.formSurname &&
                    this.user.userDescription === this.formUserDescription
            }
        },
        methods: {
            async uploadUserData() {
                if (!this.$refs.submitButton.disabled) {
                    this.uploadRunning = true;
                    try {
                        await this.$store.dispatch('userProfile/uploadUserData', {
                            forename: this.formForename, surname: this.formSurname,
                            userDescription: this.formUserDescription
                        });
                        this.$emit('close-dialog');
                    } catch (e) {
                        this.showError = true;
                        this.uploadRunning = false;
                    }
                }
            }
        },
        mixins: [validationRules]
    }
</script>

<style lang="scss">
    #dialog-upload-user-data {
        max-width: 500px;
        #dialog-upload-user-data-content {
            max-width: 500px;
            .user-description {
                margin-top: 28px;
            }

        }
    }
</style>
