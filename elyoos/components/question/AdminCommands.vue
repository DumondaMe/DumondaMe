<template>
    <div id="question-admin-commands-container">
        <v-menu bottom left offset-y id="admin-commands">
            <v-btn small fab color="secondary" slot="activator">
                <v-icon>mdi-pencil</v-icon>
            </v-btn>
            <v-list>
                <v-list-tile @click="showModifyQuestionDialog = true">
                    <v-list-tile-title>{{$t("common:question")}}</v-list-tile-title>
                </v-list-tile>
                <v-list-tile @click="showModifyTopicDialog = true">
                    <v-list-tile-title>{{$t("common:topic")}}</v-list-tile-title>
                </v-list-tile>
                <v-divider></v-divider>
                <v-list-tile @click="showDeleteQuestionDialog = true">
                    <v-list-tile-title>{{$t("common:button.delete")}}</v-list-tile-title>
                </v-list-tile>
            </v-list>
        </v-menu>
        <delete-question-dialog v-if="showDeleteQuestionDialog" @delete-question="deleteQuestion"
                                @close-dialog="showDeleteQuestionDialog = false">
        </delete-question-dialog>
        <modify-topic-dialog v-if="showModifyTopicDialog" @close-dialog="showModifyTopicDialog = false"
                             @finish="topicsChanged"
                             :title-text="$t('pages:question.modifyTopicDialog.title', {question: question.question})"
                             :existing-topics="question.topics" api="user/question/topic/"
                             :api-param="question.questionId">
        </modify-topic-dialog>
        <modify-question-dialog v-if="showModifyQuestionDialog" @close-dialog="showModifyQuestionDialog = false"
                                @finish="showModifyQuestionDialog = false">
        </modify-question-dialog>
    </div>
</template>

<script>
    import DeleteQuestionDialog from './dialog/DeleteQuestionDialog';
    import ModifyTopicDialog from '~/components/topic/dialog/ModifyTopicDialog';
    import ModifyQuestionDialog from '~/components/question/dialog/ModifyQuestionDialog';

    export default {
        components: {DeleteQuestionDialog, ModifyTopicDialog, ModifyQuestionDialog},
        data() {
            return {showDeleteQuestionDialog: false, showModifyTopicDialog: false, showModifyQuestionDialog: false}
        },
        computed: {
            question() {
                return this.$store.state.question.question;
            }
        },
        methods: {
            deleteQuestion() {
                this.$router.replace({name: 'index'});
            },
            topicsChanged(topics) {
                this.showModifyTopicDialog = false;
                this.$store.commit('question/SET_TOPICS', topics);
            }
        }
    }
</script>

<style lang="scss">
    #question-admin-commands-container {
        margin-left: 4px;
        height: 40px;
        display: inline-block;
        #admin-commands {

        }
    }
</style>
