<template>
    <v-layout row justify-center>
        <v-dialog v-model="dialog" scrollable persistent max-width="650px">
            <question @close-dialog="$emit('close-dialog')" @finish="changeQuestion" :loading="loading"
                      :init-question="$store.getters['question/getQuestionInfo']"
                      :action-button-text="$t('pages:question.modifyQuestionDialog.changeButton')"
                      :is-modify-mode="true">
                <div slot="header">
                    <div id="elyoos-dialog-header">
                        {{$t('pages:question.modifyQuestionDialog.title', getTitle())}}
                    </div>
                    <v-divider></v-divider>
                </div>
            </question>
        </v-dialog>
    </v-layout>
</template>

<script>
    import Question from './Question';

    export default {
        props: [],
        data() {
            return {dialog: true, loading: false}
        },
        components: {Question},
        methods: {
            getTitle() {
                return JSON.parse(JSON.stringify({question: this.$store.getters['question/getQuestionInfo'].question}));
            },
            async changeQuestion(question) {
                try {
                    this.loading = true;
                    let response = await this.$axios.$put(`/user/question/${this.$route.params.questionId}`, question);
                    question.descriptionHtml = response.descriptionHtml;
                    this.$store.commit('question/SET_QUESTION_INFO', question);
                    this.$emit('finish');
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
