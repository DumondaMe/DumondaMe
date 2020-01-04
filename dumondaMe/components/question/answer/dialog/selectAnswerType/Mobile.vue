<template>
    <div>
        <div class="answer-button" @click="$emit('answer-selected', 'text')">
            <div class="answer-type">
                <v-icon>{{$icons.mdiTooltipText}}</v-icon>
            </div>
            <div class="answer-description">{{$t('pages:question.selectAnswerDialog.textDescription')}}
            </div>
        </div>
        <div class="answer-button" @click="$emit('answer-selected', 'video')">
            <div class="answer-type">
                <v-icon>{{$icons.mdiVideo}}</v-icon>
            </div>
            <div class="answer-description">{{$t('pages:question.selectAnswerDialog.videoDescription')}}
            </div>
        </div>
        <div class="answer-button" @click="$emit('answer-selected', 'link')">
            <div class="answer-type">
                <v-icon>$vuetify.icons.mdiLink</v-icon>
            </div>
            <div class="answer-description">{{$t('pages:question.selectAnswerDialog.linkDescription')}}
            </div>
        </div>
        <div class="answer-button" @click="$emit('answer-selected', 'book')">
            <div class="answer-type">
                <v-icon>{{$icons.mdiBookOpenPageVariant}}</v-icon>
            </div>
            <div class="answer-description">{{$t('pages:question.selectAnswerDialog.bookDescription')}}
            </div>
        </div>
        <div class="answer-button last-button" @click="$emit('answer-selected', 'commitment')">
            <div class="answer-type">
                <v-icon>$vuetify.icons.mdiHumanHandsup</v-icon>
            </div>
            <div class="answer-description">
                {{$t('pages:question.selectAnswerDialog.commitmentDescription')}}
            </div>
        </div>
    </div>
</template>

<script>
    import {mdiTooltipText, mdiVideo, mdiBookOpenPageVariant} from '@mdi/js';

    export default {
        created() {
            this.$icons = {mdiTooltipText, mdiVideo, mdiBookOpenPageVariant}
        }
    }
</script>

<style lang="scss">
    #select-answer-type-container {
        .select-answer-mobile {
            .answer-button {
                display: flex;
                padding: 8px;
                cursor: pointer;
                border-bottom: 1px solid $divider;

                .answer-type {
                    .v-icon {
                        margin-top: 4px;
                        color: $primary-color;
                        font-size: 28px;
                    }
                }
                .answer-description {
                    margin-left: 18px;
                    font-size: 16px;
                }
            }
            .answer-button.last-button {
                border: none;
            }
            :hover.answer-button {
                background-color: $hover;
            }
        }
    }
</style>
