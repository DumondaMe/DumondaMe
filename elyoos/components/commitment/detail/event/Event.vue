<template>
    <div class="commitment-event ely-card">
        <div class="event-header-container">
            <div class="event-title" v-if="event.linkDescription"><a target="_blank" :href="event.linkDescription"
                                                                     class="link">{{event.title}} </a></div>
            <div class="event-title" v-else>{{event.title}}</div>
            <v-spacer v-if="isAdmin"></v-spacer>
            <v-menu bottom left v-if="isAdmin">
                <v-btn icon slot="activator">
                    <v-icon>mdi-dots-vertical</v-icon>
                </v-btn>
                <v-list>
                    <v-list-tile @click="showEditEvent = true">
                        <v-list-tile-title>{{$t("pages:detailCommitment.events.editEvent")}}</v-list-tile-title>
                    </v-list-tile>
                    <v-list-tile @click="showEditLocation= true">
                        <v-list-tile-title>{{$t("pages:detailCommitment.events.editLocation")}}</v-list-tile-title>
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
                <span class="footer-text">{{event.startDate | formatFromToDate(event.endDate, $t('common:at'))}}</span>
            </div>
            <div class="footer-icon">
                <v-icon>mdi-map-marker</v-icon>
                <span class="footer-text">{{event.location}} ({{$t("regions:" + event.region)}})</span>
            </div>
            <div class="footer-icon" v-if="event.linkDescription">
                <v-icon>mdi-calendar-text</v-icon>
                <span class="footer-text">
                    <a target="_blank" :href="event.linkDescription" class="link">{{linkDescriptionWithoutProtocol}}</a>
                </span>
            </div>
        </div>
        <delete-event-dialog :event="event.title" :event-id="event.eventId" v-if="showDeleteEvent"
                             @close-dialog="showDeleteEvent = false">
        </delete-event-dialog>
        <edit-event-dialog :init-event="event" v-if="showEditEvent" @finish="showEditEvent = false"
                           @close-dialog="showEditEvent = false">
        </edit-event-dialog>
        <edit-location-dialog :init-event="event" v-if="showEditLocation" @finish="showEditLocation = false"
                              @close-dialog="showEditLocation = false">
        </edit-location-dialog>
    </div>
</template>

<script>
    import moment from 'moment';
    import DeleteEventDialog from '~/components/commitment/dialog/event/DeleteEventDialog';
    import EditEventDialog from '~/components/commitment/dialog/event/EditEventDialog';
    import EditLocationDialog from '~/components/commitment/dialog/event/EditLocationDialog';

    export default {
        props: ['event'],
        name: "commitmentEvent",
        components: {DeleteEventDialog, EditEventDialog, EditLocationDialog},
        data() {
            return {showEditEvent: false, showEditLocation: false, showDeleteEvent: false}
        },
        computed: {
            linkDescriptionWithoutProtocol() {
                if (this.event && this.event.linkDescription) {
                    return this.event.linkDescription.replace(/(^\w+:|^)\/\//, '');
                }
                return '';
            },
            isAdmin() {
                return this.$store.state.commitment.commitment.isAdmin;
            }
        }
    }
</script>

<style lang="scss">
    .commitment-event {
        margin-bottom: 12px;
        .event-header-container {
            display: flex;
            .event-title {
                color: $primary-color;
                font-size: 16px;
                a {
                    text-decoration: none;
                }
                a:hover {
                    text-decoration: underline;
                }
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
                    a {
                        color: $secondary-text;
                        text-decoration: none;
                    }
                    a:hover {
                        text-decoration: underline;
                    }
                }
            }
        }
    }
</style>