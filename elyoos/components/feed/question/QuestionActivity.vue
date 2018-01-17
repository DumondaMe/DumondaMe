<template>
    <div>
        <div id="question-activity">
            <span id="question-text" @click="dialog = true">{{$t("pages:feeds.question.yourQuestion")}}</span>
        </div>
        <v-layout row justify-center>
            <v-dialog v-model="dialog" scrollable persistent max-width="500px">
                <search-question v-if="searchQuestion"
                                 @question-changed="newQuestion => question = newQuestion"
                                 @create-question="createNewQuestion"
                                 @close-dialog="closeDialog">
                </search-question>
                <create-question v-else :question="question"
                                 @close-dialog="closeDialog"></create-question>
            </v-dialog>
        </v-layout>
    </div>
</template>

<script>
    import SearchQuestion from './SearchQuestion.vue';
    import CreateQuestion from './CreateQuestion.vue';

    export default {
        components: {SearchQuestion, CreateQuestion},
        computed: {
            isAuthenticated() {
                return this.$store.state.auth.userIsAuthenticated
            }
        },
        data: function () {
            return {
                dialog: false, searchQuestion: true, question: ''
            };
        },
        methods: {
            createNewQuestion(newQuestion) {
                this.question = newQuestion;
                this.searchQuestion = false;
            },
            closeDialog() {
                this.searchQuestion = true;
                this.question = '';
                this.dialog = false;
            }
        }
    }
</script>

<style lang="scss">
    #question-activity {
        background-color: white;
        border-radius: 4px;
        border: 1px solid #e0e0e0;
        padding: 12px;
        margin: 0;
        #question-text {
            font-weight: 500;
            font-size: 18px;
            color: #999;
            cursor: pointer;
        }
        :hover#question-text {
            color: $primary-color;
        }
    }
</style>
