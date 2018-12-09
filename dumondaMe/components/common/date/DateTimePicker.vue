<template>
    <div class="ely-date-time-picker">
        <div class="description">{{description}}</div>
        <div class="time-container">
            <v-menu :close-on-content-click="false" v-model="menu"
                    :nudge-right="40" lazy transition="scale-transition" offset-y>
                <v-text-field slot="activator" v-model="this.dateFormatted" prepend-icon="mdi-calendar" readonly
                              class="date-input">
                </v-text-field>
                <v-date-picker v-model="date" @input="menu = false" next-icon="mdi-chevron-right"
                               prev-icon="mdi-chevron-left" :locale="getLanguage" no-title :min="min"
                               :full-width="$vuetify.breakpoint.xsOnly">
                </v-date-picker>
            </v-menu>
            <div class="time-input-container">
                <v-text-field class="time-input" v-model="time" prepend-icon="mdi-clock"
                              :rules="[isValidTime()]">
                </v-text-field>
            </div>
        </div>
        <div class="warning-date-icon" v-if="warning">
            <v-tooltip bottom debounce="300">
                <v-icon slot="activator">mdi-alert-outline</v-icon>
                <span>{{warningText}}</span>
            </v-tooltip>
        </div>
    </div>
</template>

<script>
    import format from 'date-fns/format'
    import getTime from 'date-fns/get_time'

    export default {
        props: ['description', 'min', 'initDate', 'warning', 'warningText'],
        data() {
            return {
                time: format(this.initDate * 1000, 'HH:mm'),
                date: format(this.initDate * 1000, 'YYYY-MM-DD'),
                dateFormatted: this.$options.filters.getFormatDateOnlyShort(this.initDate),
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
                this.dateFormatted = this.$options.filters.getFormatDateOnlyShort(this.date);
                if (this.validTime) {
                    this.$emit('date-changed', {
                        date: getTime(`${this.date} ${this.time}`) / 1000, isValid: this.validTime
                    });
                }
            },
            time(time) {
                if (this.validTimeRegex(time)) {
                    this.$emit('date-changed', {
                        date: getTime(`${this.date} ${time}`) / 1000, isValid: this.validTime
                    });
                } else {
                    this.$emit('date-changed', {date: null, isValid: false});
                }
            }
        },
        methods: {
            isValidTime() {
                return v => {
                    this.validTime = this.validTimeRegex(v);
                    return this.validTime || this.$t("validation:invalidTime")
                }
            },
            validTimeRegex(time) {
                return /^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/.test(time);
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

        .time-container {
            display: flex;
            width: 100%;
            @media screen and (max-width: 390px) {
                display: block;
            }
        }

        .date-input {
            width: 132px;
            max-width: 132px;
        }

        .time-input-container {
            .time-input {
                margin-left: 18px;
                width: 90px;
                max-width: 90px;
                @media screen and (max-width: 390px) {
                    margin-left: 0;
                    margin-top: 0;
                    padding-top: 0;
                }

            }
        }

        .warning-date-icon {
            margin-left: 8px;

            i.v-icon {
                padding-top: 22px;
                color: $warning;
            }
        }
    }
</style>
