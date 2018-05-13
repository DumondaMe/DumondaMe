<template>
    <v-card id="link-answer-container">
        <v-card-title id="link-answer-title">Answer the question<span class="question-title"> {{question}} </span>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text id="link-answer-content">
            <v-form v-model="valid">
                <v-layout row wrap>
                    <v-flex xs12>
                        <v-text-field v-model="link" name="link" ref="link" :loading="checkLink"
                                      :label="$t('pages:detailQuestion.searchLink')"
                                      :rules="[isValidLink(),
                                               isValidYoutubeLink(),
                                               ruleFieldRequired($t('validation:fieldRequired')),
                                               ruleToManyChars($t('validation:toManyChars'), 1000)]">
                        </v-text-field>
                        <p class="url-type" v-show="linkToChange.type === 'Youtube'">Youtube Video erkannt</p>
                        <p class="url-type" v-show="linkToChange.type === 'Vimeo'">Vimeo Video erkannt</p>
                    </v-flex>
                    <youtube v-if="linkToChange.type === 'Youtube'" :init-link-data="linkToChange" :link="link"
                             @upload-command="setUploadCommand">
                    </youtube>
                    <website-link v-else-if="linkToChange.type === 'Link'" :init-link-data="linkToChange" :link="link"
                                  @upload-command="setUploadCommand">
                    </website-link>
                </v-layout>
            </v-form>
            <div class="elyoos-dialog-error-message" v-show="showErrorMessage">{{showErrorMessage}}</div>
            <div class="elyoos-dialog-warning-message" v-show="showWarningMessage">{{showWarningMessage}}</div>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" flat @click.native="$emit('close-dialog')">
                {{$t("common:button.close")}}
            </v-btn>
            <v-btn color="primary" @click.native="startUpload()" :loading="uploadRunning"
                   :disabled="!valid || checkLink || uploadRunning || !!this.showErrorMessage ||
                   !!this.showWarningMessage">
                {{$t("pages:detailQuestion.createAnswerButton")}}
            </v-btn>
        </v-card-actions>
    </v-card>
</template>

<script>
    import urlRegex from '~/utils/url';
    import validationRules from '~/mixins/validationRules.js';
    import WebsiteLink from './WebsiteLink';
    import Youtube from './Youtube';

    const ERROR_CODE_NO_YOUTUBE_ID = 1;
    const ERROR_CODE_ANSWER_EXISTS = 2;

    export default {
        data() {
            return {
                valid: false, checkLink: false, uploadRunning: false, showErrorMessage: false,
                showWarningMessage: false, link: '', linkToChange: {}, uploadCommand: function () {
                }
            }
        },
        components: {WebsiteLink, Youtube},
        mixins: [validationRules],
        computed: {
            question() {
                return this.$store.state.question.question.question;
            }
        },
        methods: {
            isValidLink() {
                return v => urlRegex(true).test(v) || this.$t("validation:url")
            },
            setUploadCommand(newUploadCommand) {
                this.uploadCommand = newUploadCommand;
            },
            async startUpload() {
                try {
                    this.uploadRunning = true;
                    await this.uploadCommand();
                    this.$emit('close-dialog');
                } catch (error) {
                    this.uploadRunning = false;
                }
            }
        },
        watch: {
            async link() {
                this.linkToChange = {};
                this.showErrorMessage = false;
                this.showWarningMessage = false;
                if (this.$refs.link.validate()) {
                    try {
                        let questionId = this.$store.state.question.question.questionId;
                        this.checkLink = true;
                        this.linkToChange = await this.$axios.$get(`/link/search/${questionId}`,
                            {params: {link: this.link}});
                        this.checkLink = false;
                    } catch (error) {
                        this.checkLink = false;
                        if (error.linkToChange.data.errorCode === ERROR_CODE_NO_YOUTUBE_ID) {
                            this.showErrorMessage = this.$t('pages:detailQuestion.error.invalidYoutubeId');
                        } else if (error.linkToChange.data.errorCode === ERROR_CODE_ANSWER_EXISTS) {
                            this.showWarningMessage = this.$t('pages:detailQuestion.error.linkAnswerExists');
                        } else {
                            this.showErrorMessage = this.$t('common:error.unknown');
                        }
                    }
                }
            }
        }
    }
</script>

<style lang="scss">
    #link-answer-container {
        #link-answer-title {
            display: block;
            .question-title {
                color: $primary-color;
                white-space: normal;
            }
        }
        #link-answer-content {
            .url-type {
                position: relative;
                top: -20px;
                margin-bottom: -20px;
                font-size: 12px;
                color: $success-text;
            }
        }
    }
</style>
