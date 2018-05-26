<template>
    <div class="commitment-event ely-card">
        <div class="event-header-container">
            <div class="event-title">{{event.title}}</div>
            <v-spacer v-if="isAdmin"></v-spacer>
            <v-menu bottom left v-if="isAdmin">
                <v-btn icon slot="activator">
                    <v-icon>mdi-dots-vertical</v-icon>
                </v-btn>
                <v-list>
                    <v-list-tile @click="showEditEvent = true">
                        <v-list-tile-title>{{$t("common:button.edit")}}</v-list-tile-title>
                    </v-list-tile>
                    <v-list-tile @click="showDeleteEvent = true">
                        <v-list-tile-title>{{$t("common:button.delete")}}</v-list-tile-title>
                    </v-list-tile>
                </v-list>
            </v-menu>
        </div>
        <div class="event-description">{{event.description}}</div>
        <div class="event-footer">
            <div class="footer-icon">
                <v-icon>mdi-clock</v-icon>
                <span class="footer-text">{{eventDate}}</span>
            </div>
            <div class="footer-icon">
                <v-icon>mdi-map-marker</v-icon>
                <span class="footer-text">{{event.location}} ({{$t("regions:" + event.region)}})</span>
            </div>
            <div class="footer-icon admin-icon" v-if="isAdmin">
                <v-icon>mdi-key</v-icon>
                <span v-for="(topic, index) in event.topics">
                    <span class="footer-text">{{topic}}</span><span v-if="index !== event.topics.length -1">,</span>
                </span>
            </div>
        </div>
    </div>
</template>

<script>
    import moment from 'moment';

    export default {
        props: ['event'],
        name: "commitmentEvent",
        data() {
            return {showEditEvent: false, showDeleteEvent: false}
        },
        computed: {
            eventDate() {
                let startDate = moment.unix(this.event.startDate);
                let endDate = moment.unix(this.event.endDate);
                if (startDate.isSame(endDate, 'day')) {
                    return `${startDate.format('LL')} ${this.$t('pages:detailCommitment.events.at')}
                    ${startDate.format('HH:mm')} - ${endDate.format('HH:mm')}`
                }
                return `${startDate.format('LL')} ${this.$t('pages:detailCommitment.events.at')}
                ${startDate.format('HH:mm')} - ${endDate.format('LL')} ${endDate.format('HH:mm')}`
            },
            isAdmin() {
                return this.$store.state.commitment.commitment.isAdmin;
            }
        }
    }
</script>

<style lang="scss">
    .commitment-event {
        margin-bottom: 8px;
        .event-header-container {
            display: flex;
            .event-title {
                color: $primary-color;
                font-size: 16px;
            }
            .menu {
                button {
                    margin: 0;
                    width: 24px;
                    height: 24px;
                    i.icon {
                        font-size: 20px;
                    }
                }
            }
        }
        .event-date {
            font-weight: 300;
            font-size: 14px;
            margin-bottom: 8px;
        }
        .event-description {
            margin-top: 12px;
            font-weight: 300;
            white-space: pre-wrap;
        }
        .event-footer {
            margin-top: 12px;
            margin-left: -2px;
            .footer-icon {
                i.icon {
                    font-size: 18px;
                }
                .footer-text {
                    margin-left: 4px;
                    font-size: 12px;
                    font-weight: 400;
                    color: $secondary-text;
                    .footer-link {
                        cursor: pointer;
                    }
                    :hover.footer-link {
                        text-decoration: underline;
                    }
                }
            }
            .footer-icon.admin-icon {
                i.icon {
                    color: $primary-color;
                }
            }
        }
    }
</style>