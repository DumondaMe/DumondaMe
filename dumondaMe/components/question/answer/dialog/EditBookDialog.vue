<template>
    <v-layout row justify-center>
        <v-dialog v-model="dialog" scrollable persistent max-width="650px">
            <answer-book @close-dialog="$emit('close-dialog')" :init-book="initBook" :answer-id="answerId"
                         :action-button-text="$t('pages:detailQuestion.editAnswerButton')">
                <div id="elyoos-dialog-header">
                    {{$t('pages:detailQuestion.editAnswerTitle', {answer: initBook.title})}}
                </div>
            </answer-book>
        </v-dialog>
    </v-layout>
</template>

<script>
    import AnswerBook from './book/EditBook';

    export default {
        props: ['initBook', 'answerId'],
        components: {AnswerBook},
        data() {
            return {dialog: true}
        }
    }
</script>
