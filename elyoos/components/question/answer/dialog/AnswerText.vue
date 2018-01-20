<template>
    <v-card id="select-answer-type-container">
        <v-card-title>Answers the question <span class="question-title"> {{question}} </span></v-card-title>
        <v-divider></v-divider>
        <v-card-text>
            <v-form v-model="valid">
                <v-layout row wrap>
                    <v-flex xs12>
                        <v-text-field type="text" v-model="answer" name="answer"
                                      multi-line auto-grow rows="1"
                                      :label="$t('pages:detailQuestion.yourAnswer')"
                                      :rules="[ruleMinLength($t('validation:minLength', {length: 10}), 10),
                                               ruleToManyChars($t('validation:toManyChars'), 500)]"
                                      :counter="500" required>
                        </v-text-field>
                    </v-flex>
                </v-layout>
            </v-form>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" flat @click.native="$emit('close-dialog')">
                {{$t("common:button.close")}}
            </v-btn>
            <v-btn color="primary" flat @click.native="createTextAnswer()" :disabled="!valid">
                {{$t("common:button.answer")}}
            </v-btn>
        </v-card-actions>
    </v-card>
</template>

<script>
    import validationRules from '~/mixins/validationRules.js';

    export default {
        data() {
            return {valid: false, answer: ''}
        },
        mixins: [validationRules],
        computed: {
            question() {
                return this.$store.state.question.question.question;
            }
        },
        methods: {
            async createTextAnswer() {
                await this.$store.dispatch('question/createTextAnswer',
                    {answer: this.answer});
            }
        }
    }
</script>

<style lang="scss">
    #select-answer-type-container {
        width: 100%;
        .question-title {
            padding-left: 8px;
            font-weight: 500;
        }
        .answer-button {
            width: 150px;
            height: 150px;
            border-radius: 4px;
            border: 1px solid $primary-color-button;
            margin: 16px auto;
            padding: 8px;
            cursor: pointer;

            @media screen and (max-width: 700px) and (min-width: 600px) {
                width: 120px;
                height: 120px;
            }
            @media screen and (max-width: 350px) {
                width: 120px;
                height: 120px;
            }

            .answer-type {
                margin-top: 20px;
                color: $primary-color-button;
                text-align: center;
                font-size: 14px;
                font-weight: 500;
                @media screen and (max-width: 700px) and (min-width: 600px) {
                    margin-top: 0px;
                }
                @media screen and (max-width: 350px) {
                    margin-top: 0px;
                }
            }
            .answer-description {
                margin-top: 18px;
                text-align: center;
                font-size: 12px;
                color: $secondary-text;
                @media screen and (max-width: 700px) and (min-width: 600px) {
                    font-size: 11px;
                }
                @media screen and (max-width: 350px) {
                    font-size: 11px;
                }
            }
        }
        :hover.answer-button {
            background-color: $hover;
        }
    }
</style>
