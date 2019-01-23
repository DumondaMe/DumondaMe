<template>
    <div class="ely-start-end-date-time-picker">
        <date-time-picker :description="startDateDescription" :min="min" :init-date="initStartDate" ref="startDate"
                          @time-changed="startTimeChanged"
                          @date-changed="startDateChanged" @time-changed-on-blur="startTimeChangedOnBlur">
        </date-time-picker>
        <date-time-picker :description="endDateDescription" :min="min" :init-date="initEndDate" ref="endDate"
                          @date-changed="endDateChanged"
                          @time-changed="endTimeChanged"
                          @time-changed-on-blur="endTimeChangedOnBlur">
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
            return {
                startDateAfterEndDate: false, endDate: this.initEndDate,
                startDate: this.initStartDate
            }
        },
        methods: {
            startDateChanged({date, isValid}) {
                if (isValid) {
                    this.startDate = date;
                    this.startTimeChangedOnBlur(date);
                }
                this.$emit(`start-date-changed`, {date, isValid, startDateAfterEndDate: false});
            },
            endDateChanged({date, isValid}) {
                if (isValid) {
                    this.endDate = date;
                    this.endTimeChangedOnBlur(date);
                }
                this.$emit(`end-date-changed`, {date, isValid, startDateAfterEndDate: false});
            },
            startTimeChanged({date, isValid}) {
                if (isValid) {
                    this.startDate = date;
                }
                this.$emit(`start-date-changed`, {date, isValid, startDateAfterEndDate: date >= this.endDate});
            },
            endTimeChanged({date, isValid}) {
                if (isValid) {
                    this.endDate = date;
                }
                this.$emit(`end-date-changed`, {date, isValid, startDateAfterEndDate: this.startDate >= date});
            },
            async startTimeChangedOnBlur(date) {
                if (date >= this.endDate) {
                    this.$refs.endDate.updateDate(date + HOUR)
                }
            },
            async endTimeChangedOnBlur(date) {
                if (this.startDate >= date) {
                    this.$refs.startDate.updateDate(date - HOUR)
                }
            }
        },
    }
</script>

<style lang="scss">
    .ely-start-end-date-time-picker {

    }
</style>
