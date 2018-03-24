<template>
    <v-card id="question-container">
        <div>
            <slot name="header"></slot>
        </div>
        <v-card-text>
            <v-form v-model="valid">
                <v-layout row wrap>
                    <v-flex xs12>
                        <v-text-field type="text" v-model="question.question" name="question"
                                      :label="$t('pages:feeds.question.yourQuestion')"
                                      :rules="[ruleFieldRequired($t('validation:fieldRequired')),
                                               ruleToManyChars($t('validation:toManyChars'), 80)]"
                                      :counter="80">
                        </v-text-field>
                    </v-flex>
                    <v-flex xs12>
                        <v-text-field type="text" v-model="question.description" name="description" multi-line auto-grow
                                      rows="1"
                                      :label="$t('common:description')"
                                      :rules="[ruleToManyChars($t('validation:toManyChars'), 700)]"
                                      :counter="700">
                        </v-text-field>
                    </v-flex>
                    <v-flex xs12>
                        <v-select v-model="question.lang" id="select-language"
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
            <v-btn color="primary" @click.native="$emit('finish', question)"
                   :disabled="!valid || loading">
                {{actionButtonText}}
            </v-btn>
        </v-card-actions>
    </v-card>
</template>

<script>
    import validationRules from '~/mixins/validationRules.js';
    import languages from '~/mixins/languages.js';

    export default {
        props: ['initQuestion', 'actionButtonText', 'loading'],
        data: function () {
            return {
                question: this.initQuestion, valid: false
            };
        },
        mixins: [validationRules, languages]
    }
</script>

<style lang="scss">
    #question-container {
        #select-language {
            label {
                display: inline-block;
                max-width: 100%;
            }
        }
    }
</style>
