<template>
    <v-card id="edit-commitment-answer">
        <v-card-title id="commitment-answer-title" v-html="$t('pages:question.answerDialog.title', {question})">
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text id="commitment-answer-content">
            <v-form v-model="valid">
                <div id="commitment-container">
                    <div id="commitment-image">
                        <img :src="commitment.imageUrl"/>
                    </div>
                    <div id="commitment-content">
                        <div class="commitment-title">{{commitment.title}}</div>
                        <v-textarea v-model="commitment.description" rows="5"
                                      :label="$t('pages:question.answerDialog.answerDescriptionCommitment')"
                                      :rules="[ruleFieldRequired($t('validation:fieldRequired')),
                                               ruleToManyChars($t('validation:toManyChars'), 700)]" :counter="700">
                        </v-textarea>
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
            <v-btn color="primary" flat @click.native="$emit('selected-commitment', null)" v-show="!answerId">
                {{$t("common:button.back")}}
            </v-btn>
            <v-btn color="primary" @click.native="createCommitmentAnswer()" :loading="uploadRunning"
                   :disabled="!valid || uploadRunning || !hasChanged">
                {{actionButtonText}}
            </v-btn>
        </v-card-actions>
        <v-snackbar top v-model="showError" color="error" :timeout="0">{{$t("common:error.unknown")}}
            <v-btn dark flat @click="showError = false">{{$t("common:button.close")}}</v-btn>
        </v-snackbar>
    </v-card>
</template>

<script>
    import languages from '~/mixins/languages.js';
    import validationRules from '~/mixins/validationRules.js';

    export default {
        props: ['initCommitment', 'answerId', 'actionButtonText'],
        data() {
            return {
                valid: false, uploadRunning: false, commitment: JSON.parse(JSON.stringify(this.initCommitment)),
                showError: false
            }
        },
        mixins: [validationRules, languages],
        computed: {
            question() {
                return `<span class="question-title"> ${this.$store.state.question.question.question}</span>`;
            },
            hasChanged() {
                if (this.answerId) {
                    return this.initCommitment.description !== this.commitment.description;
                }
                return true;
            }
        },
        methods: {
            async createCommitmentAnswer() {
                this.uploadRunning = true;
                try {
                    let answerId;
                    if (this.answerId) {
                        await this.$store.dispatch('question/editCommitmentAnswer', {
                            description: this.commitment.description, answerId: this.answerId
                        });
                    } else {
                        answerId = await this.$store.dispatch('question/createCommitmentAnswer', {
                            title: this.commitment.title, description: this.commitment.description,
                            commitmentId: this.commitment.commitmentId, questionSlug: this.$route.params.slug
                        });
                    }
                    this.$emit('close-dialog', answerId);
                } catch (error) {
                    this.showError = true;
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
