<template>
    <v-card id="question-instruction-container">
        <div id="question-instruction-container-header">
            <stepper-header>
                <step :number="1" :selected-step="step" @navigate-to-step="navigateToStep">
                </step>
                <v-divider></v-divider>
                <step :number="2" :selected-step="step" @navigate-to-step="navigateToStep">
                </step>
                <v-divider></v-divider>
                <step :number="3" :selected-step="step" @navigate-to-step="navigateToStep">
                </step>
                <v-divider></v-divider>
                <step :number="4" :selected-step="step" @navigate-to-step="navigateToStep">
                </step>
                <v-divider></v-divider>
                <step :number="5" :selected-step="step" @navigate-to-step="navigateToStep">
                </step>
                <v-divider></v-divider>
                <step :number="6" :selected-step="step" @navigate-to-step="navigateToStep">
                </step>
            </stepper-header>
        </div>
        <v-card-text class="mobile-dialog-content question-instruction-content">
            <div v-if="step === 1">
                <div class="instruction-title">{{$t('pages:question.instructionDialog.step1Title')}}</div>
                <div class="description">{{$t('pages:question.instructionDialog.description')}}</div>
            </div>
            <div v-else-if="step === 2">
                <div class="instruction-title">{{$t('pages:question.instructionDialog.instruction1.title')}}</div>
                <div class="instruction-description">{{$t('pages:question.instructionDialog.instruction1.description')}}
                </div>
                <div class="instruction-bad-sample sample"
                     v-html="$t('pages:question.instructionDialog.instruction1.badSample')">
                </div>
                <div class="instruction-good-sample sample"
                     v-html="$t('pages:question.instructionDialog.instruction1.goodSample')">
                </div>
            </div>
            <div v-else-if="step === 3">
                <div class="instruction-title">{{$t('pages:question.instructionDialog.instruction2.title')}}</div>
                <div class="instruction-description">{{$t('pages:question.instructionDialog.instruction2.description')}}
                </div>
            </div>
            <div v-else-if="step === 4">
                <div class="instruction-title">{{$t('pages:question.instructionDialog.instruction3.title')}}</div>
                <div class="instruction-description">{{$t('pages:question.instructionDialog.instruction3.description')}}
                </div>
                <div class="instruction-good-sample sample"
                     v-html="$t('pages:question.instructionDialog.instruction3.goodSample')">
                </div>
            </div>
            <div v-else-if="step === 5">
                <div class="instruction-title">{{$t('pages:question.instructionDialog.instruction4.title')}}</div>
                <div class="instruction-description">{{$t('pages:question.instructionDialog.instruction4.description')}}
                </div>
            </div>
            <div v-else-if="step === 6">
                <div class="instruction-title">{{$t('pages:question.instructionDialog.instruction5.title')}}</div>
                <div class="instruction-description">
                    {{$t('pages:question.instructionDialog.instruction5.description')}}
                </div>
            </div>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
            <v-btn color="primary" text @click="step--" v-show="step > 1">
                {{$t("common:button.back")}}
            </v-btn>
            <v-spacer></v-spacer>
            <v-btn color="primary" text @click.native="$emit('close-dialog')">{{$t("common:button.close")}}</v-btn>
            <v-btn color="primary" @click="navigationButtonPressed">
                {{$t("common:button.next")}}
            </v-btn>
        </v-card-actions>
    </v-card>
</template>

<script>
    import StepperHeader from '~/components/common/stepper/StepperHeader'
    import Step from '~/components/common/stepper/Step'

    export default {
        data: function () {
            return {enableNext: true, step: 1, hasAcknowledge: false};
        },
        methods: {
            navigationButtonPressed() {
                if (this.step < 6) {
                    this.step = this.step + 1;
                } else {
                    this.$emit('next')
                }
            },
            navigateToStep(step) {
                this.step = step;
            }
        },
        components: {StepperHeader, Step},
        computed: {
            hasAskedQuestion() {
                return this.$store.state.createQuestion.hasAskedQuestion;
            }
        }
    }
</script>

<style lang="scss">
    #question-instruction-container {
        max-width: 650px;

        #question-instruction-container-header {
            max-width: 650px;
        }

        .question-instruction-content {
            max-width: 650px;

            .description {
                font-weight: 300;
                text-align: center;
                font-size: 16px;
                color: $primary-text;
            }

            .instruction-title {
                font-weight: 500;
                color: $primary-color;
                font-size: 22px;
                margin-top: 0;
                margin-bottom: 18px;
                text-align: center;
            }

            .instruction-description {
                font-weight: 300;
                font-size: 16px;
                color: $primary-text;
            }

            .sample {
                margin-top: 12px;
                font-weight: 300;
                font-size: 16px;
                color: $primary-text;
                padding: 4px 12px;

                b {
                    font-weight: 500;
                }
            }

            .acknowledge-checkbox {
                .v-input__control {
                    margin: 0 auto;
                }
            }

            .instruction-bad-sample {
                border-left: 4px solid $error-text;

            }

            .instruction-good-sample {
                border-left: 4px solid $success-text;
            }
        }
    }
</style>
