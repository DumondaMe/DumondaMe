<template>
    <v-card id="link-answer-container">
        <v-card-title id="link-answer-title" v-html="$t('pages:question.answerDialog.title', {question})">
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text id="link-answer-content">
            <div class="info-answer" v-if="isVideo">{{$t('pages:question.answerDialog.answerInfoVideo')}}</div>
            <div class="info-answer" v-else>{{$t('pages:question.answerDialog.answerInfoLink')}}</div>
            <v-form v-model="valid">
                <v-text-field v-model="link" name="link" ref="link" :loading="checkLink"
                              :label="$t('pages:detailQuestion.searchLink')"
                              :disabled="!!answerId" :hint="linkHint" :persistent-hint="!initLink"
                              :rules="[isValidLink(),
                                       isValidYoutubeLink(),
                                       ruleFieldRequired($t('validation:fieldRequired')),
                                       ruleToManyChars($t('validation:toManyChars'), 1000)]">
                </v-text-field>
                <div class="dumonda-me-dialog-warning-message" v-show="showWarningMessage">{{showWarningMessage}}</div>
                <div v-if="validLinkType" class="link-content">
                    <youtube v-if="linkData.type === 'Youtube'" :init-link-data="linkData" :link="link"
                             :answer-id="answerId" @upload-command="setUploadCommand"
                             @close-dialog="answerId => $emit('close-dialog', answerId)"
                             @link-data-changed="setHasChanged">
                    </youtube>
                    <website-link v-else-if="linkData.type === 'Link'" :init-link-data="linkData"
                                  :link="link" :answer-id="answerId" @upload-command="setUploadCommand"
                                  @close-dialog="answerId => $emit('close-dialog', answerId)"
                                  @link-data-changed="setHasChanged">
                    </website-link>
                </div>
                <div v-else-if="valid">
                    <div class="invalid-link-type-info" v-if="linkData.type === 'Link' && isVideo">
                        <div>{{$t('pages:question.answerLinkDialog.answerInfoWrongType')}}</div>
                        <v-btn color="primary" @click="isVideo = false">
                            <v-icon>mdi-link</v-icon>
                            {{$t('pages:question.answerLinkDialog.answerSwitchTypeButton')}}
                        </v-btn>
                    </div>
                    <div class="invalid-link-type-info" v-if="linkData.type === 'Youtube' && !isVideo">
                        <div>{{$t('pages:question.answerVideoDialog.answerInfoWrongType')}}</div>
                        <v-btn color="primary" @click="isVideo = true">
                            <v-icon>mdi-video</v-icon>
                            {{$t('pages:question.answerVideoDialog.answerSwitchTypeButton')}}
                        </v-btn>
                    </div>
                </div>
            </v-form>
            <div class="dumonda-me-dialog-error-message" v-show="showErrorMessage">{{showErrorMessage}}</div>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" flat @click.native="$emit('close-dialog')">
                {{$t("common:button.close")}}
            </v-btn>
            <v-btn color="primary" @click.native="startUpload()" :loading="uploadRunning"
                   :disabled="!valid || checkLink || uploadRunning || !!this.showErrorMessage ||
                   !hasChanged || !validLinkType">
                {{actionButtonText}}
            </v-btn>
        </v-card-actions>
        <v-snackbar top v-model="showError" color="error" :timeout="0">{{$t("common:error.unknown")}}
            <v-btn dark flat @click="showError = false">{{$t("common:button.close")}}</v-btn>
        </v-snackbar>
    </v-card>
</template>

<script>
    import urlRegex from '~/utils/url';
    import validationRules from '~/mixins/validationRules.js';
    import WebsiteLink from './WebsiteLink';
    import Youtube from './Youtube';
    import debounce from 'debounce';
    import Vue from 'vue';

    const ERROR_CODE_NO_YOUTUBE_ID = 1;
    const ERROR_CODE_ANSWER_EXISTS = 2;
    const PAGE_NOT_FOUND = 404;

    export default {
        props: ['initLinkData', 'initLink', 'answerId', 'actionButtonText', 'initIsVideo', 'initType'],
        data() {
            let linkData = JSON.parse(JSON.stringify(this.initLinkData));
            if (this.initType) {
                linkData.type = this.initType;
            }
            return {
                valid: false, checkLink: false, uploadRunning: false, showErrorMessage: false,
                showWarningMessage: false, link: this.initLink, linkData: linkData,
                isVideo: this.initIsVideo, hasChanged: !this.answerId, uploadCommand: function () {
                }, showError: false
            }
        },
        components: {WebsiteLink, Youtube},
        mixins: [validationRules],
        computed: {
            question() {
                return `<span class="question-title"> ${this.$store.state.question.question.question}</span>`;
            },
            linkHint() {
                if (this.isVideo) {
                    return this.$t('pages:question.answerDialog.answerHintVideo');
                }
                return this.$t('pages:question.answerDialog.answerHintLink');
            },
            validLinkType() {
                let isValid = false;
                if (this.linkData.type === 'Youtube' && this.isVideo) {
                    isValid = true
                } else if (this.linkData.type === 'Link' && !this.isVideo) {
                    isValid = true
                }
                return isValid;
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
                    this.showError = true;
                    this.uploadRunning = false;
                }
            }
        },
        watch: {
            link: debounce(async function () {
                this.linkData = {};
                this.showErrorMessage = false;
                this.showWarningMessage = false;
                if (typeof this.link === 'string') {
                    this.link = this.link.trim();
                }
                if (this.$refs.link.validate()) {
                    try {
                        let questionId = this.$store.state.question.question.questionId;
                        this.checkLink = true;
                        this.linkData = await this.$axios.$get(`/link/search/${questionId}`,
                            {params: {link: this.link}});
                        this.checkLink = false;
                        Vue.set(this.linkData, 'description', '');
                    } catch (error) {
                        this.checkLink = false;
                        if (error.response.data.errorCode === ERROR_CODE_NO_YOUTUBE_ID) {
                            this.showErrorMessage = this.$t('pages:detailQuestion.error.invalidYoutubeId');
                        } else if (error.response.data.errorCode === ERROR_CODE_ANSWER_EXISTS) {
                            this.showErrorMessage = this.$t('pages:detailQuestion.error.linkAnswerExists');
                        } else if (error.response.status === PAGE_NOT_FOUND) {
                            this.showWarningMessage = this.$t('pages:detailQuestion.error.websiteNotFound');
                            this.linkData = {type: 'Link', title: '', description: ''};
                        } else {
                            this.showErrorMessage = this.$t('common:error.unknown');
                        }
                    }
                }
            }, 500)
        }
    }
</script>

<style lang="scss">
    #link-answer-container {
        .info-answer {
            font-weight: 300;
            margin-bottom: 12px;
        }
        #link-answer-title {
            display: block;
            .question-title {
                color: $primary-color;
                white-space: normal;
            }
        }
        .dumonda-me-dialog-warning-message {
            max-width: 500px;
        }
        #link-answer-content {
            .invalid-link-type-info {
                margin-top: 12px;
                color: $warning;
                button {
                    margin-left: 0;
                }
                i.v-icon {
                    margin-right: 8px;
                }
            }
            .link-content {
                margin-top: 12px;
            }
        }
    }
</style>
