<template>
    <div class="sidebar-container">
        <h3>{{$t("pages:detailQuestion.sidebar.admin.title")}}</h3>
        <div id="question-admin-container">
            <p>{{$t("pages:detailQuestion.sidebar.admin.description")}}</p>
            <div id="admin-commands">
                <v-menu bottom left offset-y>
                    <v-btn outline fab small color="primary" slot="activator">
                        <v-icon>edit</v-icon>
                    </v-btn>
                    <v-list>
                        <v-list-tile @click="">
                            <v-list-tile-title>{{$t("common:question")}}</v-list-tile-title>
                        </v-list-tile>
                        <v-list-tile @click="showModifyTopicDialog = true">
                            <v-list-tile-title>{{$t("common:topic")}}</v-list-tile-title>
                        </v-list-tile>
                    </v-list>
                </v-menu>
                <v-btn outline fab small color="primary" @click.native="showDeleteQuestionDialog = true">
                    <v-icon>delete</v-icon>
                </v-btn>
            </div>
        </div>
        <delete-question-dialog v-if="showDeleteQuestionDialog" @delete-question="deleteQuestion"
                                @close-dialog="showDeleteQuestionDialog = false">
        </delete-question-dialog>
        <modify-topic-dialog v-if="showModifyTopicDialog" @close-dialog="showModifyTopicDialog = false"
                             @finish="topicsChanged"
                             :title-text="$t('pages:question.modifyTopicDialog.title', {question: question.question})"
                             :existing-topics="question.topics" api="user/question/topic/"
                             :api-param="question.questionId">
        </modify-topic-dialog>
    </div>
</template>

<script>
    import DeleteQuestionDialog from './DeleteQuestionDialog';
    import ModifyTopicDialog from '~/components/topic/dialog/ModifyTopicDialog';

    export default {
        components: {DeleteQuestionDialog, ModifyTopicDialog},
        data() {
            return {showDeleteQuestionDialog: false, showModifyTopicDialog: false}
        },
        computed: {
            question() {
                return this.$store.state.question.question;
            }
        },
        methods: {
            deleteQuestion() {
                this.$router.push({name: 'index'});
            },
            topicsChanged(topics) {
                this.showModifyTopicDialog = false;
                this.$store.commit('question/SET_TOPICS', topics);
            }
        }
    }
</script>

<style lang="scss">
    #question-admin-container {
        p {
            font-size: 14px;
            font-weight: 300;
            margin-bottom: 6px;
        }
        #admin-commands {
            button {
                margin-left: 0;
                margin-right: 16px;
            }
        }
    }
</style>
