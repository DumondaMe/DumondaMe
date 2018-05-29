<template>
    <div id="events-container">
        <h2>{{$t('pages:detailCommitment.events.title')}}
            <span class="select-event-container">
                (<span :class="{'selected': selectUpComing}" class="select-event" @click="upComingEvents()">{{$t('pages:detailCommitment.events.upcoming')}}</span> |
                <span :class="{'selected': !selectUpComing}" class="select-event" @click="pastEvents()">{{$t('pages:detailCommitment.events.past')}}</span>)</span>
        </h2>
        <div id="event-admin-commands" v-if="isAdmin">
            <v-btn color="primary" @click="showCreateEventDialog = true">
                <v-icon>mdi-calendar-plus</v-icon>
                {{$t('common:button.create')}}
            </v-btn>
        </div>
        <div v-if="!loading">
            <div v-for="event in events">
                <event :event="event"></event>
            </div>
            <div v-if="events.length === 0">
                <div class="ely-card no-events-description" v-if="selectUpComing">
                    {{$t('pages:detailCommitment.events.noUpComingEvents')}}</div>
                <div class="ely-card no-events-description" v-else>
                    {{$t('pages:detailCommitment.events.noPastEvents')}}</div>
            </div>
        </div>
        <div class="ely-loading-progress" v-else>
            <v-progress-circular indeterminate color="primary"></v-progress-circular>
        </div>
        <create-event-dialog v-if="showCreateEventDialog" @close-dialog="showCreateEventDialog = false"
                             :init-topic="$store.state.commitment.commitment.topics"
                             :commitment-id="$route.params.commitmentId">
        </create-event-dialog>
    </div>
</template>

<script>
    import CreateEventDialog from '~/components/commitment/dialog/event/CreateDialog';
    import Event from './Event';

    export default {
        name: "commitmentEvents",
        components: {CreateEventDialog, Event},
        data() {
            return {showCreateEventDialog: false, selectUpComing: true, loading: false}
        },
        computed: {
            events() {
                return this.$store.state.commitment.commitment.events;
            },
            isAdmin() {
                return this.$store.state.commitment.commitment.isAdmin;
            }
        },
        methods: {
            async upComingEvents() {
                this.selectUpComing = true;
                this.loading = true;
                try {
                    await this.$store.dispatch('commitment/getEvents',
                        {isUpComingEvents: true, commitmentId: this.$route.params.commitmentId});
                } catch (error) {

                } finally {
                    this.loading = false;
                }
            },
            async pastEvents() {
                this.selectUpComing = false;
                this.loading = true;
                try {
                    await this.$store.dispatch('commitment/getEvents',
                        {isUpComingEvents: false, commitmentId: this.$route.params.commitmentId});
                } catch (error) {

                } finally {
                    this.loading = false;
                }
            }
        },
    }
</script>

<style lang="scss">
    #events-container {
        .select-event-container {
            font-size: 12px;
            .select-event {
                cursor: pointer;
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
                i.icon {
                    margin-right: 8px;
                    font-size: 20px;
                }
            }
        }
        .no-events-description {
            font-weight: 300;
        }
    }
</style>