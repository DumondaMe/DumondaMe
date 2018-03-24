<template>
    <div class="sidebar-container">
        <h3>{{$t("pages:detailQuestion.sidebar.admin.title")}}</h3>
        <div id="question-admin-container">
            <p>{{$t("pages:detailQuestion.sidebar.admin.description")}}</p>
            <div id="admin-commands">
                <v-btn outline fab small color="primary">
                    <v-icon>edit</v-icon>
                </v-btn>
                <v-btn outline fab small color="primary" @click.native="showDeleteQuestionDialog = true">
                    <v-icon>delete</v-icon>
                </v-btn>
            </div>
        </div>
        <delete-question-dialog v-if="showDeleteQuestionDialog" @delete-question="deleteQuestion"
                                @close-dialog="showDeleteQuestionDialog = false">
        </delete-question-dialog>
    </div>
</template>

<script>
    import DeleteQuestionDialog from './DeleteQuestionDialog';

    export default {
        components: {DeleteQuestionDialog},
        data() {
            return {showDeleteQuestionDialog: false}
        },
        methods: {
            deleteQuestion() {
                this.$router.push({name: 'index'});
            }
        },
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
