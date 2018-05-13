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
                                      :disabled="!!answerId"
                                      :rules="[isValidLink(),
                                               isValidYoutubeLink(),
                                               ruleFieldRequired($t('validation:fieldRequired')),
                                               ruleToManyChars($t('validation:toManyChars'), 1000)]">
                        </v-text-field>
                        <p class="url-type" v-show="linkData.type === 'Youtube'" v-if="!answerId">
                            Youtube Video erkannt</p>
                        <p class="url-type" v-show="linkData.type === 'Vimeo'" v-if="!answerId">
                            Vimeo Video erkannt</p>
                    </v-flex>
                    <youtube v-if="linkData.type === 'Youtube'" :init-link-data="linkData" :link="link"
                             :answer-id="answerId" @upload-command="setUploadCommand"
                             @link-data-changed="setHasChanged">
                    </youtube>
                    <website-link v-else-if="linkData.type === 'Link'" :init-link-data="linkData" :link="link"
                                  :answer-id="answerId" @upload-command="setUploadCommand"
                                  @link-data-changed="setHasChanged">
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
                   !!this.showWarningMessage || !hasChanged">
                {{actionButtonText}}
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
        props: ['initLinkData', 'initLink', 'answerId', 'actionButtonText'],
        data() {
            return {
                valid: false, checkLink: false, uploadRunning: false, showErrorMessage: false,
                showWarningMessage: false, link: this.initLink, linkData: JSON.parse(JSON.stringify(this.initLinkData)),
                hasChanged: !this.answerId, uploadCommand: function () {
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
            setHasChanged(hasChanged) {
                this.hasChanged = hasChanged;
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
                this.linkData = {};
                this.showErrorMessage = false;
                this.showWarningMessage = false;
                if (this.$refs.link.validate()) {
                    try {
                        let questionId = this.$store.state.question.question.questionId;
                        this.checkLink = true;
                        this.linkData = await this.$axios.$get(`/link/search/${questionId}`,
                            {params: {link: this.link}});
                        this.checkLink = false;
                    } catch (error) {
                        this.checkLink = false;
                        if (error.response.data.errorCode === ERROR_CODE_NO_YOUTUBE_ID) {
                            this.showErrorMessage = this.$t('pages:detailQuestion.error.invalidYoutubeId');
                        } else if (error.response.data.errorCode === ERROR_CODE_ANSWER_EXISTS) {
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
