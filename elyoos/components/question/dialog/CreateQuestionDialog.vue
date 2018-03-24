<template>
    <v-layout row justify-center>
        <v-dialog v-model="dialog" scrollable persistent max-width="650px">
            <create-question-dialog-content @close-dialog="$emit('close-dialog')"
                                            :init-question="$store.getters['createQuestion/getQuestionCopy']">
            </create-question-dialog-content>
        </v-dialog>
    </v-layout>
</template>

<script>
    import CreateQuestionDialogContent from './CreateQuestionDialogContent';

    export default {
        data() {
            return {dialog: true}
        },
        components: {CreateQuestionDialogContent}
    }
</script>

<style lang="scss">

</style>
