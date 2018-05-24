<template>
    <div class="ely-start-end-date-time-picker">
        <date-time-picker :description="startDateDescription" :min="min" :init-date="startDate"
                          @date-changed="startDateChanged">
        </date-time-picker>
        <date-time-picker :description="endDateDescription" :min="min" :init-date="endDate"
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
            return {startDate: this.initStartDate, endDate: this.initEndDate}
        },
        methods: {
            startDateChanged({date, isValid}) {
                if (isValid) {
                    this.startDate = date;
                    if (this.startDate > this.endDate) {
                        this.endDate = this.startDate + HOUR;
                    }
                }
                this.$emit(`start-date-changed`, {date, isValid});
            },
            endDateChanged({date, isValid}) {
                if (isValid) {
                    this.endDate = date;
                    if (this.startDate > this.endDate) {
                        this.startDate = this.endDate - HOUR;
                    }
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
