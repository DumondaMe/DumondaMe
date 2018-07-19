<template>
    <v-layout row justify-center>
        <v-dialog v-model="dialog" scrollable persistent max-width="650px">
            <event-content v-if="showPage === 1" @close-dialog="$emit('close-dialog')"
                           @finish="finishEventData" :action-button-text="$t('common:button.next')"
                           :init-event="$store.getters['createEvent/getEventCopy']">
                <stepper slot="header" :selected-step="showPage"></stepper>
            </event-content>
            <location v-else-if="showPage === 2" @close-dialog="$emit('close-dialog')" @finish="finishLocation"
                      :action-button-text="$t('pages:commitment.createEventDialog.createEventButton')"
                      :loading="loading" :init-location="''">
                <stepper slot="header" :selected-step="showPage"></stepper>
            </location>
        </v-dialog>
        <v-snackbar top v-model="showError" color="error" :timeout="0">{{$t("common:error.unknown")}}
            <v-btn dark flat @click="showError = false">{{$t("common:button.close")}}</v-btn>
        </v-snackbar>
    </v-layout>
</template>

<script>
    import EventContent from './Event';
    import Location from './Location';
    import Stepper from './Stepper';

    export default {
        props: ['commitmentId'],
        data() {
            return {dialog: true, showPage: 1, loading: false, showError: false}
        },
        components: {EventContent, Location, Stepper},
        created() {
            this.$store.commit('createEvent/RESET');
        },
        methods: {
            finishEventData({event}) {
                this.$store.commit('createEvent/SET_EVENT', event);
                this.showPage = 2;
            },
            async finishLocation({region, location}) {
                try {
                    this.$store.commit('createEvent/SET_REGION', region);
                    this.$store.commit('createEvent/SET_LOCATION', location);
                    this.loading = true;
                    let event = await this.$store.dispatch('createEvent/createEvent', this.commitmentId);
                    this.$emit('finish', event);
                }
                catch (e) {
                    this.showError = true;
                } finally {
                    this.loading = false;
                }
            }
        }
    }
</script>

<style lang="scss">

</style>
