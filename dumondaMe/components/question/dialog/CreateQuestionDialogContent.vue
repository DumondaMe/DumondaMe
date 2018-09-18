<template>
    <question v-if="showPage === 1" @close-dialog="$emit('close-dialog')"
              @finish="finishQuestion" :action-button-text="$t('common:button.next')"
              :init-question="initQuestion" :is-modify-mode="false">
        <stepper slot="header" :selected-step="showPage"></stepper>
    </question>
    <topics v-else-if="showPage === 2" @close-dialog="$emit('close-dialog')" @finish="finishTopics"
            :action-button-text="$t('pages:question.createDialog.createQuestionButton')" :loading="loading"
            :description="$t('pages:question.createDialog.topicDescription')">>
        <stepper slot="header" :selected-step="showPage"></stepper>
    </topics>
</template>

<script>
    import Question from './Question';
    import Topics from '~/components/topic/dialog/Topics';
    import Stepper from './CreateQuestionStepper';

    export default {
        props: ['initQuestion'],
        data() {
            return {showPage: 1, loading: false}
        },
        components: {Question, Topics, Stepper},
        methods: {
            finishQuestion(question) {
                this.$store.commit('createQuestion/SET_QUESTION', question);
                this.showPage = 2;
            },
            async finishTopics(topics) {
                try {
                    this.$store.commit('createQuestion/SET_TOPICS', topics.map(topic => topic.id));
                    this.loading = true;
                    let response = await this.$store.dispatch('createQuestion/createNewQuestion');
                    this.loading = false;
                    this.$emit('close-dialog');
                    this.$router.push({
                        name: 'question-questionId-slug',
                        params: {questionId: response.questionId, slug: response.slug}
                    });
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
