<template>
    <div id="question-admin-commands-container">
        <v-menu bottom left offset-y id="admin-commands">
            <template v-slot:activator="{ on }">
                <v-btn small fab color="secondary" v-on="on">
                    <v-icon size="20">mdi-pencil</v-icon>
                </v-btn>
            </template>
            <v-list>
                <v-list-item @click="showModifyQuestionDialog = true">
                    <v-list-item-title>{{$t("common:question")}}</v-list-item-title>
                </v-list-item>
                <v-list-item @click="showModifyTopicDialog = true">
                    <v-list-item-title>{{$t("common:topic")}}</v-list-item-title>
                </v-list-item>
                <v-divider></v-divider>
                <v-list-item @click="showDeleteQuestionDialog = true">
                    <v-list-item-title>{{$t("common:button.delete")}}</v-list-item-title>
                </v-list-item>
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
        margin-left: 18px;
        height: 40px;
        display: inline-block;
        @media screen and (max-width: $xs) {
            margin-left: 0;
        }
    }
</style>
