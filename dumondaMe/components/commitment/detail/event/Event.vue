<template>
    <div class="commitment-event ely-card">
        <div class="event-header-container">
            <div>
                <div class="event-title" v-if="event.linkDescription"><a target="_blank" :href="event.linkDescription"
                                                                         class="link">{{event.title}} </a></div>
                <div class="event-title" v-else>{{event.title}}</div>
                <div class="event-date">{{event.startDate | formatFromToDate(event.endDate, $t('common:at'))}}</div>
            </div>
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
                <v-icon>mdi-map-marker</v-icon>
                <span class="footer-text">{{event.location}} ({{event.region.description}})</span>
            </div>
            <div class="footer-icon" v-if="event.linkDescription">
                <v-icon medium>mdi-calendar-text</v-icon>
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
            .event-date {
                font-size: 14px;
                font-weight: 300;
                color: $secondary-text;
            }
            .v-menu {
                margin-left: 8px;
                .v-menu__activator {
                    align-items: flex-start;
                    .v-btn {
                        margin: 0;
                    }
                }
            }
            .menu {
                button {
                    margin: 0;
                    width: 24px;
                    height: 24px;
                    i.v-icon {
                        font-size: 20px;
                    }
                }
            }
        }
        .event-description {
            margin-top: 12px;
            font-weight: 300;
            white-space: pre-wrap;
        }
        .event-footer {
            margin-top: 12px;
            .footer-icon {
                vertical-align: top;
                display: inline-block;
                height: 40px;
                .v-icon {
                    display: inline-block;
                    height: 24px;
                    width: 24px;
                    color: #009688;
                }
                .footer-text {
                    display: inline-block;
                    margin-left: 4px;
                    font-size: 14px;
                    font-weight: 400;
                    color: $secondary-text;
                    line-height: 24px;
                    height: 24px;
                    vertical-align: middle;
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