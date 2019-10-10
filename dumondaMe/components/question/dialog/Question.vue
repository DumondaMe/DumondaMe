<template>
    <v-card id="question-container">
        <div>
            <slot name="header"></slot>
        </div>
        <v-card-text class="mobile-dialog-content">
            <v-form v-model="valid">
                <v-layout row wrap>
                    <v-flex xs12>
                        <v-select v-model="question.lang" id="select-language"
                                  :label="$t('pages:feeds.selectLanguage')"
                                  :rules="[ruleSelectRequired($t('validation:fieldRequired'))]"
                                  :items="getLanguages()"
                                  single-line required>
                        </v-select>
                    </v-flex>
                    <v-flex xs12>
                        <v-text-field type="text" v-model="question.question" name="question"
                                      :label="$t('common:question')"
                                      :rules="[ruleFieldRequired($t('validation:fieldRequired')),
                                               ruleToManyChars($t('validation:toManyChars'), 200)]"
                                      :counter="200" :loading="loadingExistingQuestions">
                        </v-text-field>
                        <div class="existing-questions-container">
                            <div class="existing-question" v-for="existingQuestion in existingQuestions">
                                <div class="question" @click="goToQuestion(existingQuestion)">
                                    {{existingQuestion.question}}
                                </div>
                                <div class="number-of-answers">
                                    {{$t('pages:question.createDialog.numberOfAnswers',
                                    {count: existingQuestion.numberOfAnswers})}}
                                </div>
                            </div>
                        </div>
                    </v-flex>
                    <v-flex xs12>
                        <v-textarea type="text" v-model="question.description" name="description" auto-grow
                                    rows="1"
                                    :label="$t('common:description')"
                                    :rules="[ruleToManyChars($t('validation:toManyChars'), 2000)]"
                                    :counter="2000">
                        </v-textarea>
                    </v-flex>
                </v-layout>
            </v-form>
            <div class="asking-question-help-link" v-if="hasAskedQuestion" @click="$emit('open-instruction')">
                {{$t('pages:question.createDialog.instructionLink')}}
            </div>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" text
                   @click.native="$emit('close-dialog')" :disabled="loading">{{$t("common:button.close")}}
            </v-btn>
            <v-btn color="primary" @click.native="finish"
                   :disabled="!valid || loading || !hasChanged || loadingExistingQuestions">
                {{actionButtonText}}
            </v-btn>
        </v-card-actions>
    </v-card>
</template>

<script>
    import validationRules from '~/mixins/validationRules.js';
    import languages from '~/mixins/languages.js';
    import debounce from 'debounce';

    export default {
        props: ['initQuestion', 'actionButtonText', 'loading', 'isModifyMode'],
        data: function () {
            return {
                question: JSON.parse(JSON.stringify(this.initQuestion)),
                questionCompare: JSON.parse(JSON.stringify(this.initQuestion)), valid: false,
                loadingExistingQuestions: false, existingQuestions: []
            };
        },
        computed: {
            questionModel() {
                return this.question.question;
            },
            hasChanged() {
                if (this.isModifyMode) {
                    return (this.question.question !== this.questionCompare.question ||
                        this.question.description !== this.questionCompare.description ||
                        this.question.lang !== this.questionCompare.lang);
                }
                return true;
            },
            hasAskedQuestion() {
                return this.$store.state.createQuestion.hasAskedQuestion;
            }
        },
        mixins: [validationRules, languages],
        methods: {
            finish() {
                let params = {question: this.question.question, lang: this.question.lang};
                if (this.question.description && this.question.description.trim() !== '') {
                    params.description = this.question.description;
                }
                if (this.question.questionId) {
                    params.questionId = this.question.questionId;
                }
                this.$emit('finish', params);
            },
            goToQuestion(question) {
                this.$emit('close-dialog');
                this.$router.push({
                    name: 'question-questionId-slug',
                    params: {questionId: question.questionId, slug: question.slug}
                });
            }
        },
        watch: {
            questionModel: debounce(async function (newQuestion) {
                if (typeof newQuestion === 'string' && newQuestion.trim().length > 10 && !this.isModifyMode) {
                    try {
                        this.loadingExistingQuestions = true;
                        let response = await this.$axios.$get('search/questions',
                            {params: {query: newQuestion, lang: this.question.lang, skip: 0, limit: 15}});
                        this.existingQuestions = response.questions;
                    } finally {
                        this.loadingExistingQuestions = false;
                    }
                }
            }, 500)
        }
    }
</script>

<style lang="scss">
    #question-container {
        .asking-question-help-link {
            cursor: pointer;
            font-size: 14px;
            color: $secondary-text;
            margin-top: 12px;
        }

        .existing-questions-container {
            .existing-question {
                margin-bottom: 8px;

                .question {
                    cursor: pointer;
                    font-size: 16px;
                    font-weight: 500;
                }

                :hover.question {
                    text-decoration: underline;
                }

                .number-of-answers {
                    font-size: 14px;
                    color: $secondary-text;
                }
            }
        }

        :hover.asking-question-help-link {
            text-decoration: underline;
        }

        #select-language {
            label {
                display: inline-block;
                max-width: 100%;
            }
        }
    }
</style>
