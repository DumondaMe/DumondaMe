<template>
    <div>
        <div id="question-activity">
            <span id="question-text" @click="dialog = true">{{$t("pages:feeds.yourQuestion")}}</span>
        </div>
        <v-layout row justify-center v-if="dialog">
            <v-dialog v-model="dialog" scrollable persistent max-width="500px">
                <search-question v-if="searchQuestion"
                                 @create-question="createNewQuestion"
                                 @close-dialog="dialog = false">
                </search-question>
                <create-question v-else :action-button-text="$t('common:button.next')"
                                 :init-question="$store.getters['createQuestion/getQuestionCopy']"
                                 @close-dialog="dialog = false">
                </create-question>
            </v-dialog>
        </v-layout>
    </div>
</template>

<script>
    import SearchQuestion from './SearchQuestion.vue';
    import CreateQuestion from '~/components/question/dialog/CreateQuestionDialogContent';

    export default {
        components: {SearchQuestion, CreateQuestion},
        computed: {
            isAuthenticated() {
                return this.$store.state.auth.userIsAuthenticated
            }
        },
        data: function () {
            return {
                dialog: false, searchQuestion: true
            };
        },
        methods: {
            createNewQuestion(newQuestion) {
                this.$store.commit('createQuestion/SET_QUESTION',
                    {question: newQuestion, description: '', lang: 'de'});
                this.searchQuestion = false;
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
