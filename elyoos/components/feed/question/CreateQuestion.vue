<template>
    <v-card id="create-question-container">
        <v-card-text>
            <v-form v-model="valid">
                <v-layout row wrap>
                    <v-flex xs12>
                        <v-text-field type="text" v-model="newQuestion" name="question"
                                      :label="$t('pages:feeds.question.yourQuestion')"
                                      :rules="[ruleFieldRequired($t('validation:fieldRequired')),
                                               ruleToManyChars($t('validation:toManyChars'), 80)]"
                                      :counter="80">
                        </v-text-field>
                    </v-flex>
                    <v-flex xs12>
                        <v-text-field type="text" v-model="description" name="description" multi-line auto-grow rows="1"
                                      :label="$t('common:description')"
                                      :rules="[ruleToManyChars($t('validation:toManyChars'), 700)]"
                                      :counter="700">
                        </v-text-field>
                    </v-flex>
                    <v-flex xs12 md5>
                        <v-select v-model="selectTopic"
                                  :label="$t('pages:feeds.question.selectTopic')"
                                  :rules="[ruleSelectMultipleRequired($t('validation:fieldRequired'))]"
                                  multiple required
                                  :items="getTopics()">
                        </v-select>
                    </v-flex>
                    <v-flex xs12 md5 offset-md2>
                        <v-select v-model="selectLang" id="select-language"
                                  :label="$t('pages:feeds.question.selectLanguage')"
                                  :rules="[ruleSelectRequired($t('validation:fieldRequired'))]"
                                  :items="getLanguages()"
                                  single-line bottom required>
                        </v-select>
                    </v-flex>
                </v-layout>
            </v-form>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" flat :disabled="loading"
                   @click.native="$emit('close-dialog')">{{$t("common:button.close")}}
            </v-btn>
            <v-btn color="primary" flat @click.native="createNewQuestion"
                   :disabled="!valid || loading">
                {{$t("common:button.create")}}
            </v-btn>
        </v-card-actions>
    </v-card>
</template>

<script>
    import validationRules from '~/mixins/validationRules.js';
    import languages from '~/mixins/languages.js';

    export default {
        props: ['question'],
        data: function () {
            return {
                newQuestion: this.question, description: '', valid: false, selectTopic: [],
                selectLang: this.$store.state.i18n.language, loading: false
            };
        },
        mixins: [validationRules,  languages],
        methods: {
            createNewQuestion: async function () {
                try {
                    this.loading = true;
                    let response = await this.$axios.$post('/user/question', {
                        question: this.newQuestion,
                        description: this.description,
                        topic: this.selectTopic,
                        lang: this.selectLang
                    });
                    this.loading = false;
                    this.$emit('close-dialog');
                    this.$router.push({
                        name: 'question-questionId-slug',
                        params: {questionId: response.questionId, slug: response.slug}
                    });
                } catch (error) {
                    this.loading = false;
                }
            }
        }
    }
</script>

<style lang="scss">
    #create-question-container {
        #select-language {
            label {
                display: inline-block;
                max-width: 100%;
            }
        }
    }
</style>
