<template>
    <v-layout row justify-center>
        <v-dialog v-model="dialog" scrollable persistent max-width="650px">
            <question @close-dialog="$emit('close-dialog')" @finish="changeQuestion" :loading="loading"
                      :init-question="$store.getters['question/getQuestionInfo']"
                      :action-button-text="$t('pages:question.modifyQuestionDialog.changeButton')"
                      :is-modify-mode="true">
                <div slot="header">
                    <div id="dumonda-me-dialog-header">
                        {{$t('pages:question.modifyQuestionDialog.title', getTitle())}}
                    </div>
                    <v-divider></v-divider>
                </div>
            </question>
        </v-dialog>
        <v-snackbar top v-model="showError" color="error" :timeout="0">{{$t("common:error.unknown")}}
            <v-btn dark flat @click="showError = false">{{$t("common:button.close")}}</v-btn>
        </v-snackbar>
    </v-layout>
</template>

<script>
    import Question from './Question';

    export default {
        props: [],
        data() {
            return {dialog: true, loading: false, showError: false}
        },
        components: {Question},
        methods: {
            getTitle() {
                return JSON.parse(JSON.stringify({question: this.$store.getters['question/getQuestionInfo'].question}));
            },
            async changeQuestion(question) {
                try {
                    this.loading = true;
                    question.questionId = this.$route.params.questionId;
                    let response = await this.$axios.$put(`/user/question`, question);
                    question.descriptionHtml = response.descriptionHtml;
                    this.$store.commit('question/SET_QUESTION_INFO', question);
                    this.$emit('finish');
                }
                catch (e) {
                    this.showError = true;
                    this.loading = false;
                }
            }
        }
    }
</script>

<style lang="scss">

</style>
