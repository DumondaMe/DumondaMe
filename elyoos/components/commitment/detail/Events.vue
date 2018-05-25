<template>
    <div id="events-container" v-if="events.length > 0 || isAdmin">
        <h2>{{$t('pages:detailCommitment.events.title')}}</h2>
        <div id="event-admin-commands" v-if="isAdmin">
            <v-btn color="primary" outline @click="showCreateEventDialog = true">
                <v-icon>mdi-calendar-plus</v-icon>
                Veranstaltung
            </v-btn>
            <v-btn color="primary" outline @click="showCreateEventDialog = true">
                <v-icon>mdi-calendar-plus</v-icon>
                Webinar
            </v-btn>
        </div>
        <div class="event ely-card" :class="{'last-event': index === events.length - 1}"
             v-for="(event, index) in events">
            <div class="event-title">{{event.title}}</div>
            <div class="description">{{event.description}}</div>
        </div>
        <create-event-dialog v-if="showCreateEventDialog" @close-dialog="showCreateEventDialog = false"
                             :init-topic="$store.state.commitment.commitment.topics"
                             :commitment-id="$route.params.commitmentId">
        </create-event-dialog>
    </div>
</template>

<script>
    import CreateEventDialog from '~/components/commitment/dialog/event/CreateDialog';

    export default {
        name: "questions",
        components: {CreateEventDialog},
        data() {
            return {showCreateEventDialog: false}
        },
        computed: {
            events() {
                return this.$store.state.commitment.commitment.events;
            },
            isAdmin() {
                return this.$store.state.commitment.commitment.isAdmin;
            }
        },
    }
</script>

<style lang="scss">
    #events-container {
        #event-admin-commands {
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