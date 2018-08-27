<template>
    <v-card id="select-answer-type-container">
        <v-card-title>{{$t('pages:question.selectAnswerDialog.title')}}</v-card-title>
        <v-divider></v-divider>
        <v-card-text>
            <v-layout row wrap>
                <v-flex xs6 sm4>
                    <div class="answer-button" @click="$emit('answer-selected', 'text')">
                        <div class="answer-type"><v-icon>mdi-tooltip-text</v-icon></div>
                        <div class="answer-description">{{$t('pages:question.selectAnswerDialog.textDescription')}}
                        </div>
                    </div>
                </v-flex>
                <v-flex xs6 sm4>
                    <div class="answer-button" @click="$emit('answer-selected', 'video')">
                        <div class="answer-type"><v-icon>mdi-video</v-icon></div>
                        <div class="answer-description">{{$t('pages:question.selectAnswerDialog.videoDescription')}}
                        </div>
                    </div>
                </v-flex>
                <v-flex xs6 sm4>
                    <div class="answer-button" @click="$emit('answer-selected', 'link')">
                        <div class="answer-type"><v-icon>mdi-link</v-icon></div>
                        <div class="answer-description">{{$t('pages:question.selectAnswerDialog.linkDescription')}}
                        </div>
                    </div>
                </v-flex>
                <v-flex xs6 sm4>
                    <div class="answer-button" @click="$emit('answer-selected', 'book')">
                        <div class="answer-type"><v-icon>mdi-book-open-page-variant</v-icon></div>
                        <div class="answer-description">{{$t('pages:question.selectAnswerDialog.bookDescription')}}
                        </div>
                    </div>
                </v-flex>
                <v-flex xs6 sm4>
                    <div class="answer-button" @click="$emit('answer-selected', 'commitment')">
                        <div class="answer-type"><v-icon>mdi-human-handsup</v-icon></div>
                        <div class="answer-description">
                            {{$t('pages:question.selectAnswerDialog.commitmentDescription')}}
                        </div>
                    </div>
                </v-flex>
            </v-layout>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" flat @click.native="$emit('close-dialog')">
                {{$t("common:button.close")}}
            </v-btn>
        </v-card-actions>
    </v-card>
</template>

<style lang="scss">
    #select-answer-type-container {
        width: 100%;
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
                text-align: center;
                @media screen and (max-width: 700px) and (min-width: 600px) {
                    margin-top: 0px;
                }
                @media screen and (max-width: 350px) {
                    margin-top: 0px;
                }
                i.v-icon {
                    color: $primary-color;
                    font-size: 28px;
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
