<template>
    <v-layout row justify-center>
        <v-dialog v-model="dialog" scrollable persistent max-width="750px" :fullscreen="$vuetify.breakpoint.xsOnly">
            <welcome v-if="showPage === 0" @close-dialog="$emit('close-dialog')" @next="showPage = 1">
            </welcome>
            <profile-image v-if="showPage === 1" @close-dialog="$emit('close-dialog')" @next="showPage = 2">
            </profile-image>
            <region v-else-if="showPage === 2" @close-dialog="$emit('close-dialog')" @finish="finishRegion"
                    :action-button-text="$t('common:button.next')" :select-multiple="true" hide-item="international"
                    :description="$t('pages:commitment.createDialog.regionDescription')">
                <stepper slot="header" :selected-step="showPage"></stepper>
            </region>
            <topics v-else-if="showPage === 3" @close-dialog="$emit('close-dialog')" @finish="finishTopics"
                    :action-button-text="$t('common:button.next')"
                    :description="$t('pages:commitment.createDialog.topicDescription')">
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
    import Topics from '~/components/topic/dialog/Topics';
    import Region from '~/components/region/dialog/Region';
    import Stepper from './Stepper';

    const ERROR_CODE_IMAGE_TO_SMALL = 1;

    export default {
        data() {
            return {dialog: true, showPage: 0, loading: false, showError: false, showWarning: false}
        },
        components: {Topics, Region, Stepper, Welcome, ProfileImage},
        methods: {
            async finishCommitmentData({commitment}) {

            },
            finishRegion(regions) {

                this.showPage = 2;
            },
            finishTopics(topics) {

                this.showPage = 3;
            }
        }
    }
</script>

<style lang="scss">

</style>
