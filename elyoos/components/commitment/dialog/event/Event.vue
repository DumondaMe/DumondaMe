<template>
    <v-card id="dialog-event">
        <div>
            <slot name="header"></slot>
        </div>
        <v-card-text id="dialog-create-event-content">
            <v-form v-model="valid" @keydown.enter.native="finish" ref="form">
                <v-text-field v-model="event.title"
                              :label="$t('pages:commitment.createEventDialog.title')"
                              :rules="[ruleFieldRequired($t('validation:fieldRequired')),
                                       ruleToManyChars($t('validation:toManyChars'), 100)]" :counter="100">
                </v-text-field>
                <v-text-field v-model="event.description" multi-line
                              :label="$t('common:description')"
                              :rules="[ruleToManyChars($t('validation:toManyChars'), 1000)]" :counter="1000">
                </v-text-field>
                <v-text-field v-model="event.linkDescription"
                              :label="$t('pages:commitment.createEventDialog.linkDescription')"
                              :rules="[isValidLink(),
                                       ruleToManyChars($t('validation:toManyChars'), 1000)]" :counter="2000">
                </v-text-field>
            </v-form>
            <start-end-date-time-picker class="date-picker" :init-start-date="event.startDate"
                                        :init-end-date="event.endDate" :min="minDate"
                                        @start-date-changed="startDateChanged" @end-date-changed="endDateChanged"
                                        :start-date-description="$t('pages:commitment.createEventDialog.start')"
                                        :end-date-description="$t('pages:commitment.createEventDialog.end')">
            </start-end-date-time-picker>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" flat @click.native="$emit('close-dialog')">
                {{$t("common:button.close")}}
            </v-btn>
            <v-btn color="primary" @click.native="finish" :loading="loading"
                   :disabled="!valid || !validStartDate || !validEndDate || loading">
                {{actionButtonText}}
            </v-btn>
        </v-card-actions>
    </v-card>
</template>

<script>
    import moment from 'moment';
    import validationRules from '~/mixins/validationRules.js';
    import urlRegex from '~/utils/url';
    import StartEndDateTimePicker from '~/components/common/date/StartEndDateTimePicker'

    export default {
        props: ['actionButtonText', 'initEvent', 'loading'],
        components: {StartEndDateTimePicker},
        data() {
            return {
                event: JSON.parse(JSON.stringify(this.initEvent)),
                eventCompare: JSON.parse(JSON.stringify(this.initEvent)),
                valid: false,
                validStartDate: true,
                validEndDate: true,
                minDate: moment().add(1, 'd').format('YYYY-MM-DD')
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
            finish(event) {
                event.preventDefault();
                if (this.$refs.form.validate() && this.validStartDate && this.validEndDate) {
                    this.$emit('finish', {event: this.event});
                }
            },
            startDateChanged({date, isValid}) {
                this.validStartDate = isValid;
                if (isValid) {
                    this.event.startDate = date;
                }
            },
            endDateChanged({date, isValid}) {
                this.validEndDate = isValid;
                if (isValid) {
                    this.event.endDate = date;
                }
            }
        },
        mixins: [validationRules]
    }
</script>

<style lang="scss">
    #dialog-event {
        max-width: 650px;
        .date-picker {
            margin-top: 12px;
        }
    }
</style>
