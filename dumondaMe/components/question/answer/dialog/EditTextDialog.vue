<template>
    <v-layout row justify-center>
        <v-dialog v-model="dialog" scrollable persistent max-width="700px" :fullscreen="$vuetify.breakpoint.xsOnly">
            <answer-text @close-dialog="closeDialog" :init-answer="initAnswer" :answer-id="answerId"
                         :init-image="initImage" :action-button-text="$t('pages:detailQuestion.editAnswerButton')">
                <div id="dumonda-me-dialog-header">
                    {{$t('pages:detailQuestion.editAnswerTitle', {answer: answerTitle})}}
                </div>
            </answer-text>
        </v-dialog>
    </v-layout>
</template>

<script>
    import AnswerText from './text/Text';

    export default {
        props: ['initAnswer', 'initImage', 'answerId'],
        components: {AnswerText},
        data() {
            return {
                dialog: true,
                answerTitle: this.initAnswer.length > 40 ? this.initAnswer.slice(0, 40) + '...' : this.initAnswer
            }
        },
        methods: {
            async closeDialog(answerId) {
                if (answerId) {

                }
                this.$emit('close-dialog');
            }
        }
    }
</script>

<style lang="scss">
</style>
