<template>
    <v-card id="welcome-question-container">
        <div>
            <slot name="header"></slot>
        </div>
        <v-card-text class="mobile-dialog-content">
            <div id="image-question-container">
                <img :src="imageUrl"/>
            </div>
            <div class="help-hint">{{$t("dialog:welcome.stepQuestion.hint")}}</div>
            <div class="question-description" v-html="$t('dialog:welcome.stepQuestion.description')"></div>
            <ul>
                <li>{{$t("dialog:welcome.stepQuestion.link")}}</li>
                <li>{{$t("dialog:welcome.stepQuestion.youtube")}}</li>
                <li>{{$t("dialog:welcome.stepQuestion.books")}}</li>
                <li>{{$t("dialog:welcome.stepQuestion.text")}}</li>
                <li>{{$t("dialog:welcome.stepQuestion.commitment")}}</li>
            </ul>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
            <v-btn color="primary" flat @click="$emit('back')" v-if="!hideBackButton">
                {{$t("common:button.back")}}
            </v-btn>
            <v-spacer></v-spacer>
            <v-btn color="primary" flat @click="$emit('close-dialog')">
                {{$t("common:button.later")}}
            </v-btn>
            <v-btn color="primary" @click="$emit('next')">
                {{$t("common:button.next")}}
            </v-btn>
        </v-card-actions>
    </v-card>
</template>

<script>
    export default {
        props: ['hideBackButton'],
        computed: {
            imageUrl() {
                return `${process.env.staticUrl}/img/welcome/question.jpg`;
            }
        }
    }
</script>

<style lang="scss">
    #welcome-question-container {

        .question-description {
            margin-top: 18px;
            font-weight: 300;
            b {
                font-weight: 500;
                color: $primary-color;
            }
        }

        ul {
            margin-top: 12px;
            li {
                font-weight: 300;
            }
        }

        .help-hint {
            margin-bottom: 12px;
            color: $secondary-color;
        }

        #image-question-container {
            width: 400px;
            min-height: 243px;
            margin: 12px auto;
            @media screen and (max-width: $xs) {
                min-height: 182px;
                width: 300px;
            }
            @media screen and (max-width: 350px) {
                min-height: 170px;
                width: 280px;
            }
            img {
                width: 100%;
                border-radius: 6px;
            }
        }
    }
</style>
