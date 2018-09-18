<template>
    <select-answer-type @close-dialog="$emit('close-dialog')" v-if="showSelect"
                        @answer-selected="answerSelected">
    </select-answer-type>
    <answer-text v-else-if="answerType === 'text'" @close-dialog="closeDialog" init-answer=""
                 :action-button-text="$t('pages:detailQuestion.createAnswerButton')">
    </answer-text>
    <answer-link v-else-if="answerType === 'link'" @close-dialog="closeDialog" init-link="" :init-link-data="{}"
                 :action-button-text="$t('pages:detailQuestion.createAnswerButton')">
    </answer-link>
    <answer-link v-else-if="answerType === 'video'" @close-dialog="closeDialog" init-link="" :init-link-data="{}"
                 :action-button-text="$t('pages:detailQuestion.createAnswerButton')" :init-is-video="true">
    </answer-link>
    <answer-book v-else-if="answerType === 'book'" @close-dialog="closeDialog">
    </answer-book>
    <answer-commitment v-else-if="answerType === 'commitment'" @close-dialog="closeDialog">
    </answer-commitment>
</template>

<script>
    import SelectAnswerType from './SelectAnswerType';
    import AnswerText from './Text';
    import AnswerLink from './link/Link';
    import AnswerBook from './Book';
    import AnswerCommitment from './Commitment';
    import Vue from 'vue';

    export default {
        components: {SelectAnswerType, AnswerText, AnswerLink, AnswerBook, AnswerCommitment},
        data() {
            return {answerType: '', showSelect: true}
        },
        computed: {
            isAuthenticated() {
                return this.$store.state.auth.userIsAuthenticated
            }
        },
        methods: {
            answerSelected(type) {
                this.showSelect = false;
                this.answerType = type;
            },
            async closeDialog(answerId) {
                this.$emit('close-dialog');
                this.$router.replace({
                    name: 'question-questionId-slug',
                    params: {questionId: this.$route.params.questionId, slug: this.$route.params.slug},
                    query: {answerId}
                });
            }
        }
    }
</script>

<style lang="scss">
</style>
