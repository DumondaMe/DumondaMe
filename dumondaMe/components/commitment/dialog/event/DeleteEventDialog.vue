<template>
    <v-layout row justify-center>
        <v-dialog v-model="dialog" scrollable persistent max-width="400px" :fullscreen="$vuetify.breakpoint.xsOnly">
            <v-card>
                <v-card-title>
                    {{$t("pages:detailCommitment.events.deleteDialog.title")}}
                </v-card-title>
                <v-divider></v-divider>
                <v-card-text id="dialog-delete-question-content" class="mobile-dialog-content">
                    <p v-html="$t('pages:detailCommitment.events.deleteDialog.description', {event: eventToDelete})"></p>
                </v-card-text>
                <v-divider></v-divider>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="primary" flat @click.native="$emit('close-dialog')" :disabled="running">
                        {{$t("common:button.abort")}}
                    </v-btn>
                    <v-btn color="primary" @click.native="deleteEvent()"
                           :loading="running" :disabled="running">
                        {{$t("pages:detailCommitment.events.deleteDialog.deleteEventButton")}}
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <v-snackbar top v-model="showError" color="error" :timeout="0">{{$t("common:error.unknown")}}
            <v-btn dark flat @click="showError = false">{{$t("common:button.close")}}</v-btn>
        </v-snackbar>
    </v-layout>
</template>

<script>
    export default {
        props: ['event', 'eventId'],
        data() {
            return {dialog: true, running: false, showError: false}
        },
        computed: {
            eventToDelete() {
                return `<span class="event-to-delete">${this.event}</span>`
            }
        },
        methods: {
            async deleteEvent() {
                try {
                    this.running = true;
                    await this.$store.dispatch('commitment/deleteEvent', this.eventId);
                    this.$emit('close-dialog');
                } catch (error) {
                    this.showError = true;
                    this.running = false;
                }
            }
        }
    }
</script>

<style lang="scss">
    .event-to-delete {
        color: $primary-color;
    }
</style>
