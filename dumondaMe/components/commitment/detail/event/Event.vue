<template>
    <div class="commitment-event ely-card">
        <div class="event-header-container">
            <div>
                <div class="event-title" v-if="event.linkDescription"><a target="_blank" :href="event.linkDescription"
                                                                         rel="noopener"
                                                                         class="link">{{event.title}} </a></div>
                <div class="event-title" v-else>{{event.title}}</div>
                <div class="event-date">{{event.startDate | formatFromToDate(event.endDate, $t('common:at'))}}</div>
            </div>
            <v-spacer v-if="isAdmin"></v-spacer>
            <v-menu bottom left v-if="isAdmin">
                <template v-slot:activator="{ on }">
                    <v-btn icon v-on="on">
                        <v-icon>mdi-dots-vertical</v-icon>
                    </v-btn>
                </template>
                <v-list>
                    <v-list-item @click="showEditEvent = true">
                        <v-list-item-title>{{$t("pages:detailCommitment.events.editEvent")}}</v-list-item-title>
                    </v-list-item>
                    <v-list-item @click="showEditLocation= true">
                        <v-list-item-title>{{$t("pages:detailCommitment.events.editLocation")}}</v-list-item-title>
                    </v-list-item>
                    <v-list-item @click="showDeleteEvent = true">
                        <v-list-item-title>{{$t("common:button.delete")}}</v-list-item-title>
                    </v-list-item>
                </v-list>
            </v-menu>
        </div>
        <div class="event-description">{{event.description}}</div>
        <div class="event-footer">
            <div class="footer-icon">
                <v-icon>mdi-map-marker</v-icon>
                <span class="footer-text">
                    <v-tooltip bottom open-delay="500">
                        <template v-slot:activator="{ on }">
                            <span v-on="on">{{event.location}} ({{event.region.description}})</span>
                        </template>
                        <span>{{event.location}} ({{event.region.description}})</span>
                    </v-tooltip>
                </span>
            </div>
            <div class="footer-icon" v-if="event.linkDescription">
                <v-icon medium>mdi-calendar-text</v-icon>
                <span class="footer-text">
                    <v-tooltip bottom open-delay="500">
                        <template v-slot:activator="{ on }">
                            <a target="_blank" rel="noopener" :href="event.linkDescription" class="link" v-on="on">
                            {{linkDescriptionWithoutProtocol}}</a>
                        </template>
                        <span>{{event.linkDescription}}</span>
                    </v-tooltip>
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
        @include defaultPaddingCard();

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
            @media screen and (max-width: $sm) {
                margin-top: 6px;
            }
        }

        .event-footer {
            margin-top: 12px;
            @media screen and (max-width: $sm) {
                margin-top: 6px;
            }

            .footer-icon {
                vertical-align: top;
                display: flex;
                height: 40px;

                .v-icon {
                    height: 24px;
                    width: 24px;
                    color: #009688;
                }

                .footer-text {
                    margin-left: 8px;
                    font-size: 14px;
                    font-weight: 400;
                    color: $secondary-text;
                    line-height: 24px;
                    height: 24px;
                    vertical-align: middle;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;

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

    .commitment-event.ely-card {
        @media screen and (max-width: $sm) {
            padding-left: 16px;
            padding-right: 16px;
        }
    }
</style>