<template>
    <div class="ely-date-time-picker">
        <div class="description">{{description}}</div>
        <v-menu :close-on-content-click="false" v-model="menu"
                :nudge-right="40" lazy transition="scale-transition" offset-y>
            <v-text-field slot="activator" v-model="this.dateFormatted" prepend-icon="mdi-calendar" readonly
                          class="date-input">
            </v-text-field>
            <v-date-picker v-model="date" @input="menu = false" next-icon="mdi-chevron-right"
                           prev-icon="mdi-chevron-left" :locale="getLanguage" no-title :min="min">
            </v-date-picker>
        </v-menu>
        <v-text-field class="time-input" v-model="time" prepend-icon="mdi-clock"
                      :rules="[isValidTime()]">
        </v-text-field>
    </div>
</template>

<script>
    import moment from 'moment';

    export default {
        props: ['description', 'min', 'initDate'],
        data() {
            return {
                time: moment.unix(this.initDate).format('HH:mm'),
                date: moment.unix(this.initDate).format('YYYY-MM-DD'),
                dateFormatted: this.formatDate(moment.unix(this.initDate).format('YYYY-MM-DD')),
                menu: false,
                validTime: true
            }
        },
        computed: {
            getLanguage() {
                return this.$store.state.i18n.language
            }
        },
        watch: {
            date() {
                this.dateFormatted = this.formatDate(this.date);
                if (this.validTime) {
                    this.$emit('date-changed', {
                        date: moment(`${this.date} ${this.time}`, 'YYYY-MM-DD HH:mm').unix(), isValid: this.validTime
                    });
                }
            },
            time(time) {
                if (this.validTimeRegex(time)) {
                    this.$emit('date-changed', {
                        date: moment(`${this.date} ${time}`, 'YYYY-MM-DD HH:mm').unix(), isValid: true
                    });
                } else {
                    this.$emit('date-changed', {date: null, isValid: false});
                }
            },
            initDate(initDate) {
                this.time = moment.unix(initDate).format('HH:mm');
                this.date = moment.unix(initDate).format('YYYY-MM-DD');
                this.dateFormatted = this.formatDate(moment.unix(initDate).format('YYYY-MM-DD'));
                this.validTime = true;
            }
        },
        methods: {
            isValidTime() {
                return v => {
                    this.validTime = this.validTimeRegex(v);
                    return this.validTime || 'Invalid time'
                }
            },
            validTimeRegex(time) {
                return /^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/.test(time);
            },
            formatDate(date) {
                if (!date) return null;

                return moment(date).format('l');
            }
        }
    }
</script>

<style lang="scss">
    .ely-date-time-picker {
        display: flex;
        .description {
            color: $secondary-text;
            width: 120px;
            padding-top: 20px;
        }
        .date-input {
            width: 132px;
            max-width: 132px;
        }
        .time-input {
            margin-left: 18px;
            width: 90px;
            max-width: 90px;
        }
    }
</style>
