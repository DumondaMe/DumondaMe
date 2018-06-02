<template>
    <div class="ely-start-end-date-time-picker">
        <date-time-picker :description="startDateDescription" :min="min" :init-date="initStartDate"
                          :warning="startDateAfterEndDate" :warning-text="$t('common:error.startDateAfterEndDate')"
                          @date-changed="startDateChanged">
        </date-time-picker>
        <date-time-picker :description="endDateDescription" :min="min" :init-date="initEndDate"
                          @date-changed="endDateChanged">
        </date-time-picker>
    </div>
</template>

<script>
    import DateTimePicker from './DateTimePicker'

    const HOUR = 3600;

    export default {
        props: ['initStartDate', 'initEndDate', 'min', 'startDateDescription', 'endDateDescription'],
        components: {DateTimePicker},
        data() {
            return {startDate: this.initStartDate, endDate: this.initEndDate, startDateAfterEndDate: false}
        },
        methods: {
            startDateChanged({date, isValid}) {
                if (isValid) {
                    this.startDate = date;
                    this.startDateAfterEndDate = this.startDate >= this.endDate;
                    isValid = !this.startDateAfterEndDate;
                }
                this.$emit(`start-date-changed`, {date, isValid});
            },
            endDateChanged({date, isValid}) {
                if (isValid) {
                    this.endDate = date;
                    this.startDateAfterEndDate = this.startDate >= this.endDate;
                    isValid = !this.startDateAfterEndDate;
                }
                this.$emit(`end-date-changed`, {date, isValid});
            }
        },
    }
</script>

<style lang="scss">
    .ely-start-end-date-time-picker {

    }
</style>
