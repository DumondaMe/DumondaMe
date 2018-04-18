<template>
    <v-card id="edit-commitment-answer">
        <v-card-title id="commitment-answer-title">Answer the question<span class="question-title"> {{question}} </span>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text id="commitment-answer-content">
            <v-form v-model="valid">
                <div id="commitment-container">
                    <div id="commitment-image">
                        <img :src="selected.imageUrl"/>
                    </div>
                    <div id="commitment-content">
                        <div class="commitment-title">{{selected.title}}</div>
                        <v-text-field v-model="selected.description" multi-line rows="5"
                                      :label="$t('common:description')"
                                      :rules="[ruleFieldRequired($t('validation:fieldRequired')),
                                               ruleToManyChars($t('validation:toManyChars'), 700)]" :counter="700">
                        </v-text-field>

                    </div>
                </div>
            </v-form>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" flat @click.native="$emit('close-dialog')">
                {{$t("common:button.close")}}
            </v-btn>
            <v-btn color="primary" flat @click.native="$emit('selected-commitment', null)">
                {{$t("common:button.back")}}
            </v-btn>
            <v-btn color="primary" @click.native="createCommitmentAnswer()" :loading="uploadRunning"
                   :disabled="!valid || uploadRunning">
                {{$t("pages:detailQuestion.createAnswerButton")}}
            </v-btn>
        </v-card-actions>
    </v-card>
</template>

<script>
    import languages from '~/mixins/languages.js';
    import validationRules from '~/mixins/validationRules.js';

    export default {
        props: ['selected'],
        data() {
            return {valid: false, uploadRunning: false}
        },
        mixins: [validationRules, languages],
        computed: {
            question() {
                return this.$store.state.question.question.question;
            }
        },
        methods: {
            async createCommitmentAnswer() {
                this.uploadRunning = true;
                try {
                    let answerId = await this.$store.dispatch('question/createCommitmentAnswer',
                        {
                            title: this.selected.title, description: this.selected.description,
                            commitmentId: this.selected.commitmentId, questionSlug: this.$route.params.slug
                        });
                    this.$emit('close-dialog', answerId);
                } catch (error) {
                    this.uploadRunning = false;
                }
            }

        }
    }
</script>

<style lang="scss">
    #edit-commitment-answer {
        #commitment-answer-title {
            display: block;
            .question-title {
                color: $primary-color;
                white-space: normal;
            }
        }
        #commitment-answer-content {
            #commitment-container {
                #commitment-image {
                    @media screen and (min-width: 700px) {
                        float: left;
                    }
                    img {
                        width: 125px;
                        height: 125px;
                        @media screen and (max-width: 699px) {
                            display: block;
                            margin: 0 auto 18px auto;
                        }
                    }
                }
                #commitment-content {
                    @media screen and (min-width: 700px) {
                        margin-left: 168px;
                    }
                    .commitment-title {
                        line-height: 16px;
                        font-size: 16px;
                        font-weight: 500;
                        margin-bottom: 8px;
                    }

                }
            }
        }
    }
</style>
