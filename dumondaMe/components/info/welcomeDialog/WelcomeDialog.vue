<template>
    <v-layout row justify-center>
        <v-dialog v-model="dialog" scrollable persistent max-width="750px" :fullscreen="$vuetify.breakpoint.xsOnly">
            <welcome v-if="showPage === 0" @close-dialog="$emit('close-dialog')" @next="showPage = 1">
            </welcome>
            <profile-image v-if="showPage === 1" @close-dialog="$emit('close-dialog')" @next="showPage = 2">
                <stepper slot="header" :selected-step="showPage"></stepper>
            </profile-image>
            <privacy v-if="showPage === 2" @close-dialog="$emit('close-dialog')" @next="showPage = 3"
                     :init-privacy-mode="settings.privacyMode"
                     :init-show-profile-activity="settings.showProfileActivity">
                <stepper slot="header" :selected-step="showPage"></stepper>
            </privacy>
            <topics v-if="showPage === 3" @close-dialog="$emit('close-dialog')" @next="showPage = 4"
                     :init-topics="settings.interestedTopics">
                <stepper slot="header" :selected-step="showPage"></stepper>
            </topics>
        </v-dialog>
        <v-snackbar top v-model="showError" color="error" :timeout="0">{{$t("common:error.unknown")}}
            <v-btn dark flat @click="showError = false">{{$t("common:button.close")}}</v-btn>
        </v-snackbar>
        <v-snackbar top v-model="showWarning" color="warning" :timeout="0">
            {{$t("pages:commitment.createDialog.warningToSmallImage")}}
            <v-btn dark flat @click="showWarning = false">{{$t("common:button.close")}}</v-btn>
        </v-snackbar>
    </v-layout>
</template>

<script>
    import Welcome from './Welcome';
    import ProfileImage from './ProfileImage';
    import Privacy from './Privacy';
    import Topics from './Topics';
    import Stepper from './Stepper';

    export default {
        data() {
            return {dialog: true, showPage: 0, loading: false, showError: false, showWarning: false, settings: {}}
        },
        async mounted() {
            try {
                this.settings = await this.$axios.$get(`user/settings`);
            } catch (error) {

            } finally {
                this.loading = false;
            }
        },
        components: {Stepper, Welcome, ProfileImage, Privacy, Topics},
        methods: {

        }
    }
</script>

<style lang="scss">

</style>
