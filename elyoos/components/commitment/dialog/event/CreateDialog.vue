<template>
    <v-layout row justify-center>
        <v-dialog v-model="dialog" scrollable persistent max-width="650px">
            <event-content v-if="showPage === 1" @close-dialog="$emit('close-dialog')"
                                @finish="finishEventData" :action-button-text="$t('common:button.next')"
                                :init-event="$store.getters['createEvent/getEventCopy']">
                <stepper slot="header" :selected-step="showPage"></stepper>
            </event-content>
            <topics v-else-if="showPage === 2" @close-dialog="$emit('close-dialog')" @finish="finishTopics"
                    :action-button-text="$t('pages:commitment.createDialog.createEventButton')"
                    :description="$t('pages:commitment.createDialog.topicEventDescription')" :loading="loading">
                <stepper slot="header" :selected-step="showPage"></stepper>
            </topics>
        </v-dialog>
    </v-layout>
</template>

<script>
    import EventContent from './Event';
    import Topics from './Topics';
    import Stepper from './Stepper';

    export default {
        data() {
            return {dialog: true, showPage: 1, loading: false}
        },
        components: {EventContent, Topics, Stepper},
        mounted() {
            this.$store.commit('createEvent/RESET');
        },
        methods: {
            finishEventData({event}) {
                this.$store.commit('createEvent/SET_EVENT', event);
                this.showPage = 3;
            },
            async finishTopics(topics) {
                try {
                    this.$store.commit('createEvent/SET_TOPICS', topics);
                    this.loading = true;
                    let response = await this.$store.dispatch('createEvent/createEvent');
                    this.loading = false;
                    this.$emit('close-dialog');
                }
                catch (e) {
                    this.loading = false;
                }
            }
        }
    }
</script>

<style lang="scss">

</style>
