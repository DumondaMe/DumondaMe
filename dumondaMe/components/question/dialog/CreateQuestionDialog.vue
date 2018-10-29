<template>
    <v-layout row justify-center>
        <v-dialog v-model="dialog" scrollable persistent max-width="650px" :fullscreen="$vuetify.breakpoint.xsOnly">
            <div class="show-loading-create-question-dialog" v-if="loading">
                <v-progress-circular indeterminate color="primary"></v-progress-circular>
            </div>
            <show-instruction @close-dialog="closeInstruction"
                              v-else-if="(showInstruction && !hasAskedQuestion) || showInstructionAgain"
                              @next="showQuestion">
                <div slot="header">
                    <div id="dumonda-me-dialog-header">
                        {{$t('pages:question.instructionDialog.title')}}
                    </div>
                    <v-divider></v-divider>
                </div>
            </show-instruction>
            <create-question-dialog-content @close-dialog="$emit('close-dialog')" v-else
                                            @open-instruction="showInstructionAgain = true"
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
            return {dialog: true, showInstruction: true, showInstructionAgain: false, loading: false}
        },
        async created() {
            try {
                this.loading = true;
                this.$store.commit('createQuestion/RESET');
                await this.$store.dispatch('createQuestion/getHasQuestionCreated');
            } catch (e) {

            } finally {
                this.loading = false;
            }
        },
        components: {CreateQuestionDialogContent, ShowInstruction},
        methods: {
            closeInstruction() {
                if (this.showInstructionAgain) {
                    this.showInstructionAgain = false;
                    this.showInstruction = false;
                } else {
                    this.$emit('close-dialog');
                }
            },
            showQuestion() {
                this.showInstruction = false;
                this.showInstructionAgain = false
            }
        },
        computed: {
            hasAskedQuestion() {
                return this.$store.state.createQuestion.hasAskedQuestion;
            }
        }
    }
</script>

<style lang="scss">
    .show-loading-create-question-dialog {
        min-height: 400px;
    }
</style>
