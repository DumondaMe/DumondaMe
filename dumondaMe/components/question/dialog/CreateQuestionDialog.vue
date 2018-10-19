<template>
    <v-layout row justify-center>
        <v-dialog v-model="dialog" scrollable persistent max-width="650px" :fullscreen="$vuetify.breakpoint.xsOnly">
            <show-instruction @close-dialog="$emit('close-dialog')" v-if="showInstruction"
                              @next="showInstruction = false">
                <div slot="header">
                    <div id="dumonda-me-dialog-header">
                        {{$t('pages:question.instructionDialog.title')}}
                    </div>
                    <v-divider></v-divider>
                </div>
            </show-instruction>
            <create-question-dialog-content @close-dialog="$emit('close-dialog')" v-else
                                            :init-question="$store.getters['createQuestion/getQuestionCopy']">
            </create-question-dialog-content>
        </v-dialog>
    </v-layout>
</template>

<script>
    import ShowInstruction from './Instruction';
    import CreateQuestionDialogContent from './CreateQuestionDialogContent';

    export default {
        data() {
            return {dialog: true, showInstruction: true}
        },
        created() {
            this.$store.commit('createQuestion/RESET');
        },
        components: {CreateQuestionDialogContent, ShowInstruction}
    }
</script>

<style lang="scss">

</style>
