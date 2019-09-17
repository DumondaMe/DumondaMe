<template>
    <v-layout row justify-center>
        <v-dialog v-model="dialog" scrollable persistent max-width="700px" :fullscreen="$vuetify.breakpoint.xsOnly">
            <answer-link @close-dialog="$emit('close-dialog')" :init-link-data="initLinkData" :init-link="initLink"
                         :answer-id="answerId" :action-button-text="$t('pages:detailQuestion.editAnswerButton')"
                         :init-is-video="isVideo" :init-type="initType">
            </answer-link>
        </v-dialog>
    </v-layout>
</template>

<script>
    import AnswerLink from './link/Link';

    export default {
        props: ['initLink', 'initLinkData', 'answerId', 'isVideo', 'initType'],
        components: {AnswerLink},
        data() {
            return {dialog: true}
        }
    }
</script>
