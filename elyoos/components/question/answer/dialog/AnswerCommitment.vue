<template>
    <v-card id="commitment-answer-container">
        <v-card-title id="commitment-answer-title">Answer the question <span class="question-title"> {{question}}</span>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text id="commitment-answer-content">
            <v-text-field v-model="titleCommitment" :loading="searchCommitmentRunning"
                          :label="$t('pages:detailQuestion.searchCommitment')"
                          :rules="[ruleFieldRequired($t('validation:fieldRequired')),
                                   ruleToManyChars($t('validation:toManyChars'), 200)]">
            </v-text-field>
            <div v-for="commitment in commitments" class="commitment-preview"
                 :class="{'selected-commitment': (selected && selected.answerId === commitment.answerId)}"
                 @click="selected = commitment">
                <div class="commitment-image">
                    <img :src="commitment.imageUrl"/>
                </div>
                <div class="commitment-content">
                    <h3 class="commitment-title">
                        {{commitment.title}}
                    </h3>
                    <p class="commitment-description">
                        {{commitment.description}}
                    </p>
                </div>
            </div>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" flat @click.native="$emit('close-dialog')">
                {{$t("common:button.close")}}
            </v-btn>
            <v-btn color="primary" @click.native="createCommitmentAnswer()" :loading="uploadRunning"
                   :disabled="searchCommitmentRunning || uploadRunning || !selected">
                {{$t("pages:detailQuestion.createAnswerButton")}}
            </v-btn>
        </v-card-actions>
    </v-card>
</template>

<script>
    import validationRules from '~/mixins/validationRules.js';
    import debounce from 'debounce';

    export default {
        data() {
            return {
                titleCommitment: '', commitments: [], searchCommitmentRunning: false, uploadRunning: false,
                selected: null
            }
        },
        mixins: [validationRules],
        computed: {
            question() {
                return this.$store.state.question.question.question;
            }
        },
        methods: {
            createCommitmentAnswer() {

            }
        },
        watch: {
            titleCommitment: debounce(async function (newTitle) {
                if (typeof newTitle === 'string' && newTitle.trim().length > 1)
                    try {
                        this.searchCommitmentRunning = true;
                        this.commitments = await this.$axios.$get('commitment/search', {params: {query: newTitle}});
                        this.searchCommitmentRunning = false;
                    } catch (error) {
                        this.searchCommitmentRunning = false;
                    }
            }, 400)
        }
    }
</script>

<style lang="scss">
    #commitment-answer-container {
        #commitment-answer-title {
            display: block;
            .question-title {
                color: $primary-color;
                white-space: normal;
            }
        }
        #commitment-answer-content {
            .commitment-preview {
                padding-bottom: 6px;
                padding-top: 6px;
                cursor: pointer;
                display: flex;
                .commitment-image {
                    width: 80px;
                    height: 80px;
                    img {
                        width: 100%;
                        height: 100%;
                        border-radius: 4px;
                    }
                }
                .commitment-content {
                    margin-left: 24px;
                    padding: 0;
                    margin-bottom: 0;
                    .commitment-title {
                        font-size: 16px;
                        line-height: 16px;
                        margin-bottom: 4px;
                    }
                    .commitment-description {
                        font-size: 14px;
                        font-weight: 300;
                        line-height: 1.4em;
                        max-height: 4.2em;
                        overflow-y: hidden;
                    }
                }
            }
            .commitment-preview.selected-commitment {
                background: $selected;
                border-radius: 4px;
            }
            :hover.commitment-preview {
                background: $hover;
                border-radius: 4px;
            }
        }
    }
</style>
