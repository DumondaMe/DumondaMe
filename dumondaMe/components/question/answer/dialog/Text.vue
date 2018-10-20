<template>
    <v-card id="text-answer-container">
        <v-card-title id="answer-title" v-html="$t('pages:question.answerDialog.title', {question})">
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text class="mobile-dialog-content">
            <div class="info-answer">{{$t('pages:question.answerDialog.answerInfoText')}}</div>
            <v-form v-model="valid">
                <v-layout row wrap>
                    <v-flex xs12>
                        <v-textarea type="text" v-model="answer" name="answer" auto-grow rows="1"
                                      :label="$t('pages:detailQuestion.yourAnswer')"
                                      :rules="[ruleMinLength($t('validation:minLength', {length: 10}), 10),
                                               ruleToManyChars($t('validation:toManyChars'), 10000)]"
                                      :counter="10000">
                        </v-textarea>
                    </v-flex>
                </v-layout>
            </v-form>
        </v-card-text>
        <v-spacer></v-spacer>
        <v-divider></v-divider>
        <v-card-actions>
            <v-btn color="primary" flat @click.native="$emit('close-dialog')">
                {{$t("common:button.close")}}
            </v-btn>
            <v-btn color="primary" @click.native="updateTextAnswer()" :disabled="!valid || !hasChanged || loading"
                   :loading="loading">
                {{actionButtonText}}
            </v-btn>
        </v-card-actions>
        <v-snackbar top v-model="showError" color="error" :timeout="0">{{$t("common:error.unknown")}}
            <v-btn dark flat @click="showError = false">{{$t("common:button.close")}}</v-btn>
        </v-snackbar>
    </v-card>
</template>

<script>
    import validationRules from '~/mixins/validationRules.js';

    export default {
        props: ['initAnswer', 'answerId', 'actionButtonText'],
        data() {
            return {valid: false, answer: this.initAnswer, loading: false, showError: false}
        },
        mixins: [validationRules],
        computed: {
            hasChanged() {
                return this.initAnswer !== this.answer;
            },
            question() {
                return `<span class="question-title"> ${this.$store.state.question.question.question}</span>`;
            }
        },
        methods: {
            async updateTextAnswer() {
                let answerId;
                this.loading = true;
                try {
                    if (this.answerId) {
                        await this.$store.dispatch('question/editTextAnswer',
                            {answer: this.answer, answerId: this.answerId});
                    } else {
                        answerId = await this.$store.dispatch('question/createTextAnswer',
                            {answer: this.answer});
                    }
                    this.$emit('close-dialog', answerId);
                } catch (e) {
                    this.showError = true;
                } finally {
                    this.loading = false;
                }
            }
        }
    }
</script>

<style lang="scss">
    #text-answer-container {
        #answer-title {
            display: block;
            .question-title {
                color: $primary-color;
                white-space: normal;
            }
        }
        .info-answer {
            font-weight: 300;
            margin-bottom: 12px;
        }
    }
</style>
