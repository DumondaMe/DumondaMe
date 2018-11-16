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
                        <v-textarea type="text" v-model="answer" name="answer" rows="7"
                                    :label="$t('pages:detailQuestion.yourAnswer')"
                                    :rules="[ruleMinLength($t('validation:minLength', {length: 10}), 10),
                                               ruleToManyChars($t('validation:toManyChars'), 10000)]"
                                    :counter="10000">
                        </v-textarea>
                    </v-flex>
                </v-layout>
                <answer-type-info v-if="otherAnswerTypes" :commitments="otherAnswerTypes.commitment"
                                  :youtube="otherAnswerTypes.youtube" :links="otherAnswerTypes.links"
                                  @select-changed="(value) => selectedType = value">
                </answer-type-info>
            </v-form>
        </v-card-text>
        <v-spacer></v-spacer>
        <v-divider></v-divider>
        <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" flat @click.native="$emit('close-dialog')">
                {{$t("common:button.close")}}
            </v-btn>
            <v-btn color="primary" @click.native="updateTextAnswer()"
                   v-show="!otherAnswerTypes || (otherAnswerTypes && (selectedType === 'textAnswer' || !selectedType))"
                   :disabled="!valid || !hasChanged || loading || (otherAnswerTypes && !selectedType)"
                   :loading="loading">
                {{actionButtonText}}
            </v-btn>
            <v-btn color="primary" @click="$emit('change-answer-type', {type: 'video', url: selectedType.url})"
                   v-if="otherAnswerTypes && selectedType && selectedType.type === 'video'">
                <v-icon left>mdi-video</v-icon>
                {{$t('pages:question.answerTextDialog.switchVideoButton')}}
            </v-btn>
            <v-btn color="primary" @click="$emit('change-answer-type', {type: 'commitment', commitment: selectedType})"
                   v-if="otherAnswerTypes && selectedType && selectedType.type === 'commitment'">
                <v-icon left>mdi-human-handsup</v-icon>
                {{$t('pages:question.answerTextDialog.switchCommitmentButton')}}
            </v-btn>
            <v-btn color="primary" @click="$emit('change-answer-type', {type: 'link', url: selectedType.url})"
                   v-if="otherAnswerTypes && selectedType && selectedType.type === 'link'">
                <v-icon left>mdi-link</v-icon>
                {{$t('pages:question.answerTextDialog.switchLinkButton')}}
            </v-btn>
        </v-card-actions>
        <v-snackbar top v-model="showError" color="error" :timeout="0">{{$t("common:error.unknown")}}
            <v-btn dark flat @click="showError = false">{{$t("common:button.close")}}</v-btn>
        </v-snackbar>
    </v-card>
</template>

<script>
    import validationRules from '~/mixins/validationRules.js';
    import AnswerTypeInfo from './AnswerTypeInfo'

    export default {
        props: ['initAnswer', 'answerId', 'actionButtonText'],
        components: {AnswerTypeInfo},
        data() {
            return {
                valid: false, answer: this.initAnswer, loading: false, showError: false, otherAnswerTypes: null,
                selectedType: null
            }
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
            setTypeOfAnswerType(answerTypes, typeValue) {
                for (let type of answerTypes) {
                    type.type = typeValue;
                }
            },
            getCreateAnswerWithLink() {
                return !!(this.otherAnswerTypes && this.selectedType === 'textAnswer');
            },
            async updateTextAnswer() {
                let answerId;
                this.loading = true;
                try {
                    if (this.answerId) {
                        await this.$store.dispatch('question/editTextAnswer',
                            {answer: this.answer, answerId: this.answerId});
                    } else {
                        answerId = await this.$store.dispatch('question/createTextAnswer',
                            {answer: this.answer, createAnswerWithLink: this.getCreateAnswerWithLink()});
                    }
                    this.$emit('close-dialog', answerId);
                } catch (e) {
                    if (e.response.status === 406) {
                        this.otherAnswerTypes = e.response.data;
                        this.setTypeOfAnswerType(this.otherAnswerTypes.links, 'link');
                        this.setTypeOfAnswerType(this.otherAnswerTypes.youtube, 'video');
                        this.setTypeOfAnswerType(this.otherAnswerTypes.commitment, 'commitment');
                    } else {
                        this.showError = true;
                    }
                } finally {
                    this.loading = false;
                }
            }
        },
        watch: {
            answer() {
                if (!this.loading && this.otherAnswerTypes) {
                    this.otherAnswerTypes = null;
                    this.selectedType = null;
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
