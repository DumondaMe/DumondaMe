<template>
    <div id="events-container">
        <h2>{{$t('pages:detailCommitment.events.title')}}
            <span class="select-event-container">
                (<span :class="{'selected': selectUpComing}" class="select-event" @click="getEvents(true)">{{$t('pages:detailCommitment.events.upcoming')}}</span> |
                <span :class="{'selected': !selectUpComing}" class="select-event" @click="getEvents(false)">{{$t('pages:detailCommitment.events.past')}}</span>)</span>
        </h2>
        <div id="event-admin-commands" v-if="isAdmin">
            <v-btn color="secondary" @click="showCreateEventDialog = true">
                <v-icon>mdi-calendar-plus</v-icon>
                {{$t('common:button.create')}}
            </v-btn>
        </div>
        <div v-if="!loading">
            <div v-for="event in events">
                <event :event="event"></event>
            </div>
            <v-btn color="primary" outline class="show-more-events-button" @click="getNextEvents()"
                   v-if="hasMore" :loading="loadingNextEvents" :disabled="loadingNextEvents">
                {{$t('common:button.showMore')}}
            </v-btn>
            <div v-if="events.length === 0">
                <div class="ely-card no-events-description" v-if="selectUpComing">
                    {{$t('pages:detailCommitment.events.noUpComingEvents')}}
                </div>
                <div class="ely-card no-events-description" v-else>
                    {{$t('pages:detailCommitment.events.noPastEvents')}}
                </div>
            </div>
        </div>
        <div class="ely-loading-progress" v-else>
            <v-progress-circular indeterminate color="primary"></v-progress-circular>
        </div>
        <create-event-dialog v-if="showCreateEventDialog" @close-dialog="showCreateEventDialog = false"
                             @finish="eventCreated"
                             :init-topic="$store.state.commitment.commitment.topics"
                             :commitment-id="$route.params.commitmentId">
        </create-event-dialog>
        <v-snackbar top v-model="showError" color="error" :timeout="0">{{$t("common:error.unknown")}}
            <v-btn dark flat @click="showError = false">{{$t("common:button.close")}}</v-btn>
        </v-snackbar>
    </div>
</template>

<script>
    import CreateEventDialog from '~/components/commitment/dialog/event/CreateDialog';
    import Event from './Event';

    export default {
        name: "commitmentEvents",
        components: {CreateEventDialog, Event},
        data() {
            return {
                showCreateEventDialog: false, selectUpComing: true, loading: false, loadingNextEvents: false,
                showError: false
            }
        },
        computed: {
            events() {
                return this.$store.state.commitment.commitment.events;
            },
            hasMore() {
                return this.$store.state.commitment.commitment.events.length <
                    this.$store.state.commitment.commitment.totalNumberOfEvents;
            },
            isAdmin() {
                return this.$store.state.commitment.commitment.isAdmin;
            }
        },
        methods: {
            async getNextEvents() {
                this.loadingNextEvents = true;
                try {
                    await this.$store.dispatch('commitment/getNextEvents', {
                        commitmentId: this.$route.params.commitmentId
                    });
                } catch (error) {
                    this.showError = true;
                } finally {
                    this.loadingNextEvents = false;
                }
            },
            async getEvents(selectUpComing) {
                this.selectUpComing = selectUpComing;
                this.loading = true;
                try {
                    await this.$store.dispatch('commitment/getEvents', {
                        isUpComingEvents: selectUpComing,
                        commitmentId: this.$route.params.commitmentId
                    });
                } catch (error) {
                    this.showError = true;
                } finally {
                    this.loading = false;
                }
            },
            eventCreated(event) {
                this.showCreateEventDialog = false;
                this.$store.commit('commitment/ADD_EVENT', event);
            }
        },
    }
</script>

<style lang="scss">
    #events-container {
        h2 {
            @media screen and (max-width: $xs) {
                margin-top: 12px;
                border-bottom: none;
                padding-right: 16px;
                padding-left: 16px;
                font-weight: 500;
            }
        }
        .select-event-container {
            font-size: 12px;
            .select-event {
                cursor: pointer;
                user-select: none;
            }
            :hover.select-event {
                text-decoration: underline;
            }
            .select-event.selected {
                color: $primary-color;
            }
        }
        #event-admin-commands {
            margin-bottom: 12px;
            button {
                margin-left: 0;
                @media screen and (max-width: $xs) {
                    margin-left: 16px;
                }
                i.v-icon {
                    margin-right: 8px;
                    font-size: 20px;
                }
            }
        }
        .no-events-description {
            font-weight: 300;
            @media screen and (max-width: $xs) {
                padding-right: 16px;
                padding-left: 16px
            }
        }
        .show-more-events-button {
            margin-left: 0;
        }
    }
</style>