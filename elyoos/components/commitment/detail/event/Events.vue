<template>
    <div id="events-container" v-if="events.length > 0 || isAdmin">
        <h2>{{$t('pages:detailCommitment.events.title')}}
            <span class="select-event-container">
                (<span :class="{'selected': selectNext}" class="select-event">{{$t('pages:detailCommitment.events.upcoming')}}</span> |
                <span :class="{'selected': !selectNext}" class="select-event">{{$t('pages:detailCommitment.events.past')}}</span>)</span>
        </h2>
        <div id="event-admin-commands" v-if="isAdmin">
            <v-btn color="primary" @click="showCreateEventDialog = true">
                <v-icon>mdi-calendar-plus</v-icon>
                {{$t('common:button.create')}}
            </v-btn>
        </div>
        <div v-for="event in events">
            <event :event="event"></event>
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
            return {showCreateEventDialog: false, selectNext: true}
        },
        computed: {
            events() {
                return this.$store.state.commitment.commitment.events;
            },
            isAdmin() {
                return this.$store.state.commitment.commitment.isAdmin;
            }
        }
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
    }
</style>