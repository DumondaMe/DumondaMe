<template>
    <v-card id="question-instruction-container">
        <div>
            <slot name="header"></slot>
        </div>
        <v-card-text>
            <div class="description">{{$t('pages:question.instructionDialog.description')}}</div>

            <div class="instruction-title">{{$t('pages:question.instructionDialog.instruction1.title')}}</div>
            <div class="instruction-description">{{$t('pages:question.instructionDialog.instruction1.description')}}
            </div>
            <div class="instruction-bad-sample sample"
                 v-html="$t('pages:question.instructionDialog.instruction1.badSample')">
            </div>
            <div class="instruction-good-sample sample"
                 v-html="$t('pages:question.instructionDialog.instruction1.goodSample')">
            </div>

            <div class="instruction-title">{{$t('pages:question.instructionDialog.instruction2.title')}}</div>
            <div class="instruction-description">{{$t('pages:question.instructionDialog.instruction2.description')}}
            </div>

            <div class="instruction-title">{{$t('pages:question.instructionDialog.instruction3.title')}}</div>
            <div class="instruction-description">{{$t('pages:question.instructionDialog.instruction3.description')}}
            </div>
            <div class="instruction-good-sample sample"
                 v-html="$t('pages:question.instructionDialog.instruction3.goodSample')">
            </div>

            <div class="instruction-title">{{$t('pages:question.instructionDialog.instruction4.title')}}</div>
            <div class="instruction-description">{{$t('pages:question.instructionDialog.instruction4.description')}}
            </div>

            <div class="instruction-title">{{$t('pages:question.instructionDialog.instruction5.title')}}</div>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" flat @click.native="$emit('close-dialog')">{{$t("common:button.close")}}</v-btn>
            <v-btn color="primary" @click.native="$emit('next')" :disabled="!enableNext">
                {{$t("common:button.next")}}
            </v-btn>
        </v-card-actions>
    </v-card>
</template>

<script>
    export default {
        data: function () {
            return {enableNext: true};
        }
    }
</script>

<style lang="scss">
    #question-instruction-container {
        .description {
            font-weight: 300;
        }
        .instruction-title {
            font-weight: 500;
            color: $primary-color;
            font-size: 22px;
            margin-top: 26px;
            margin-bottom: 4px;
        }
        .instruction-description {
            font-weight: 300;
        }
        .sample {
            margin-top: 12px;
            font-weight: 300;
            padding: 4px 12px;
            b {
                font-weight: 500;
            }
        }
        .instruction-bad-sample {
            border-left: 4px solid $error-text;

        }
        .instruction-good-sample {
            border-left: 4px solid $success-text;
        }
    }
</style>
