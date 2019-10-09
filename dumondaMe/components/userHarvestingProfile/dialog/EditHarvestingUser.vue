<template>
    <div>
        <v-dialog v-model="dialog" scrollable persistent max-width="500px" :fullscreen="$vuetify.breakpoint.xsOnly">
            <v-card id="dialog-upload-harvesting-user-data">
                <v-card-title>
                    {{$t("pages:detailUser.profileData.changeProfileDataTitle")}}
                </v-card-title>
                <v-divider></v-divider>
                <v-card-text id="dialog-upload-harvesting-user-data-content" class="mobile-dialog-content">
                    <v-form v-model="valid">
                        <v-text-field type="text" v-model="formForename" name="forename"
                                      :label="$t('pages:detailUser.harvesting.editDialog.name')"
                                      :rules="[ruleFieldRequired($t('validation:fieldRequired')),
                                               ruleToManyChars($t('validation:toManyChars'), 120)]"
                                      :counter="120">
                        </v-text-field>
                        <v-textarea type="text" v-model="formUserDescription" name="userDescription"
                                    class="user-description"
                                    :label="$t('pages:detailUser.harvesting.editDialog.description')"
                                    :rules="[ruleToManyChars($t('validation:toManyChars'), 3000)]"
                                    :counter="3000" auto-grow>
                        </v-textarea>
                        <v-text-field type="text" v-model="formLink" name="link"
                                      :label="$t('pages:detailUser.harvesting.editDialog.link')"
                                      :rules="[isValidLink(), ruleFieldRequired($t('validation:fieldRequired')),
                                               ruleToManyChars($t('validation:toManyChars'), 2000)]"
                                      :counter="2000">
                        </v-text-field>
                        <v-text-field type="text" v-model="formAddress" name="address"
                                      :label="$t('pages:detailUser.harvesting.editDialog.address')"
                                      :rules="[ruleFieldRequired($t('validation:fieldRequired')),
                                               ruleToManyChars($t('validation:toManyChars'), 500)]"
                                      :counter="500">
                        </v-text-field>
                        <start-end-date-time-picker class="date-picker" :init-start-date="formStartDate"
                                                    :init-end-date="formEndDate"
                                                    @start-date-changed="startDateChanged"
                                                    @end-date-changed="endDateChanged"
                                                    :start-date-description="$t('pages:commitment.createEventDialog.start')"
                                                    :end-date-description="$t('pages:commitment.createEventDialog.end')">
                        </start-end-date-time-picker>
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
    </div>
</template>

<script>
    import validationRules from '~/mixins/validationRules.js';
    import urlRegex from '~/utils/url';
    import StartEndDateTimePicker from '~/components/common/date/StartEndDateTimePicker'

    export default {
        components: {StartEndDateTimePicker},
        data() {
            return {
                dialog: true, valid: false, uploadRunning: false,
                formForename: this.$store.state.userProfile.user.forename,
                formUserDescription: this.$store.state.userProfile.user.userDescription,
                formStartDate: this.$store.state.userProfile.user.start,
                formEndDate: this.$store.state.userProfile.user.end,
                formLink: this.$store.state.userProfile.user.link,
                formAddress: this.$store.state.userProfile.user.address,
                showError: false,
                validStartDate: true,
                validEndDate: true,
                startDateAfterEndDate: false
            }
        },
        computed: {
            user() {
                return this.$store.state.userProfile.user;
            },
            hasChanged() {
                return this.user.forename === this.formForename &&
                    this.user.userDescription === this.formUserDescription
            }
        },
        methods: {
            isValidLink() {
                return v => {
                    if (v && v.trim() !== '') {
                        return urlRegex(true).test(v) || this.$t("validation:url")
                    }
                    return true;
                }
            },
            startDateChanged({date, isValid, startDateAfterEndDate}) {
                this.validStartDate = isValid;
                this.startDateAfterEndDate = startDateAfterEndDate;
                if (isValid) {
                    this.formStartDate = date;
                }
            },
            endDateChanged({date, isValid, startDateAfterEndDate}) {
                this.validEndDate = isValid;
                this.startDateAfterEndDate = startDateAfterEndDate;
                if (isValid) {
                    this.formEndDate = date;
                }
            },
            async uploadUserData() {
                /*if (!this.$refs.submitButton.disabled) {
                    this.uploadRunning = true;
                    try {
                        await this.$store.dispatch('userProfile/uploadHarvestingUserData', {
                            forename: this.formForename, userDescription: this.formUserDescription
                        });
                        this.$emit('close-dialog');
                    } catch (e) {
                        this.showError = true;
                        this.uploadRunning = false;
                    }
                }*/
            }
        },
        mixins: [validationRules]
    }
</script>

<style lang="scss">
    #dialog-upload-harvesting-user-data {
        max-width: 500px;

        #dialog-upload-harvesting-user-data-content {
            max-width: 500px;

            .user-description {
                margin-top: 28px;
            }

        }
    }
</style>
