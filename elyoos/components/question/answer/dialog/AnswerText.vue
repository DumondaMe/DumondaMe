<template>
    <v-card id="text-answer-container">
        <v-card-title>Answer the question <span class="question-title"> {{question}} </span></v-card-title>
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
                                      :counter="500">
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
                {{$t("common:button.create")}}
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
                this.$emit('close-dialog');
            }
        }
    }
</script>

<style lang="scss">
    #text-answer-container {

    }
</style>
