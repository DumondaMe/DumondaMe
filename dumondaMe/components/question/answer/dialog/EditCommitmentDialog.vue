<template>
    <v-layout row justify-center>
        <v-dialog v-model="dialog" scrollable persistent max-width="650px" :fullscreen="$vuetify.breakpoint.xsOnly">
            <answer-commitment @close-dialog="$emit('close-dialog')" :init-commitment="initCommitment"
                               :answer-id="answerId" :action-button-text="$t('pages:detailQuestion.editAnswerButton')">
                <div id="dumonda-me-dialog-header">
                    {{$t('pages:detailQuestion.editAnswerTitle', {answer: initCommitment.title})}}
                </div>
            </answer-commitment>
        </v-dialog>
    </v-layout>
</template>

<script>
    import AnswerCommitment from './commitment/Edit';

    export default {
        props: ['initCommitment', 'answerId'],
        components: {AnswerCommitment},
        data() {
            return {dialog: true}
        }
    }
</script>
