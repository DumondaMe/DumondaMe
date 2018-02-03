<template>
    <v-card id="select-answer-type-container">
        <v-card-title>Select an Answer Type</v-card-title>
        <v-divider></v-divider>
        <v-card-text>
            <v-layout row wrap>
                <v-flex xs6 sm3>
                    <div class="answer-button" @click="$emit('answer-selected', 'text')">
                        <div class="answer-type">Text</div>
                        <div class="answer-description">Beantworte die Frage mit deinen Worten</div>
                    </div>
                </v-flex>
                <v-flex xs6 sm3>
                    <div class="answer-button" @click="$emit('answer-selected', 'link')">
                        <div class="answer-type">Link</div>
                        <div class="answer-description">Youtube Video, Blog, Zeitunsartikel usw.</div>
                    </div>
                </v-flex>
                <v-flex xs6 sm3>
                    <div class="answer-button">
                        <div class="answer-type">Buch</div>
                        <div class="answer-description">Ein Buch welches Antworten auf die Frage liefert</div>
                    </div>
                </v-flex>
                <v-flex xs6 sm3>
                    <div class="answer-button">
                        <div class="answer-type">Organisation</div>
                        <div class="answer-description">Welche Organisation beschäftig sich mit dieser Fragestellung?
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
                color: $primary-color-button;
                text-align: center;
                font-size: 14px;
                font-weight: 500;
                @media screen and (max-width: 700px) and (min-width: 600px) {
                    margin-top: 0px;
                }
                @media screen and (max-width: 350px) {
                    margin-top: 0px;
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
