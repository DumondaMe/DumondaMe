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
                        <p class="url-type" v-show="response.type === 'Youtube'">Youtube Video erkannt</p>
                        <p class="url-type" v-show="response.type === 'Vimeo'">Vimeo Video erkannt</p>
                    </v-flex>
                    <v-flex xs12 v-if="response.type === 'Youtube' || response.type === 'Vimeo'">
                        <v-layout row wrap>
                            <v-flex xs12 md6>
                                <iframe width="300" height="200" :src="response.linkEmbed" frameBorder="0"></iframe>
                            </v-flex>
                            <v-flex xs12 md6>
                                <v-text-field v-model="response.title"
                                              :label="$t('common:title')"
                                              :rules="[ruleFieldRequired($t('validation:fieldRequired')),
                                               ruleToManyChars($t('validation:toManyChars'), 100)]" :counter="100">
                                </v-text-field>
                                <v-text-field v-model="response.description" multi-line rows="4"
                                              :label="$t('common:description')"
                                              :rules="[ruleFieldRequired($t('validation:fieldRequired')),
                                               ruleToManyChars($t('validation:toManyChars'), 1000)]" :counter="1000">
                                </v-text-field>
                            </v-flex>
                        </v-layout>
                    </v-flex>
                    <v-flex xs12 v-else-if="response.type === 'Link'">
                        <div id="link-container">
                            <div v-if="response.imageUrl" id="link-image">
                                <img :src="response.imageUrl" v-if="response.imageUrl"/>
                            </div>
                            <div id="link-content" :class="{'image-missing': !response.imageUrl}">
                                <v-text-field v-model="response.title"
                                              :label="$t('common:title')"
                                              :rules="[ruleFieldRequired($t('validation:fieldRequired')),
                                               ruleToManyChars($t('validation:toManyChars'), 140)]" :counter="140">
                                </v-text-field>
                                <v-text-field v-model="response.description" multi-line rows="4"
                                              :label="$t('common:description')"
                                              :rules="[ruleFieldRequired($t('validation:fieldRequired')),
                                               ruleToManyChars($t('validation:toManyChars'), 1000)]" :counter="1000">
                                </v-text-field>
                                <div id="page-type-title">Um was für ein Weblink handelt es sich?</div>
                                <v-radio-group v-model="response.pageType" column id="page-type-container">
                                    <v-radio label="Artikel" value="article" color="primary">
                                    </v-radio>
                                    <v-radio label="Blog" value="blog" color="primary">
                                    </v-radio>
                                    <v-radio label="Webseite" value="website" color="primary">
                                    </v-radio>
                                </v-radio-group>
                            </div>
                        </div>
                    </v-flex>
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
            <v-btn color="primary" @click.native="createLinkAnswer()" :loading="uploadRunning"
                   :disabled="!valid || checkLink || uploadRunning || !!this.showErrorMessage ||
                   !!this.showWarningMessage">
                {{$t("pages:detailQuestion.createAnswerButton")}}
            </v-btn>
        </v-card-actions>
    </v-card>
</template>

<script>
    import languages from '~/mixins/languages.js';
    import urlRegex from '~/utils/url';
    import validationRules from '~/mixins/validationRules.js';

    const ERROR_CODE_NO_YOUTUBE_ID = 1;
    const ERROR_CODE_ANSWER_EXISTS = 2;

    export default {
        data() {
            return {
                valid: false, checkLink: false, uploadRunning: false, showErrorMessage: false,
                showWarningMessage: false, link: '', response: {}
            }
        },
        mixins: [validationRules, languages],
        computed: {
            question() {
                return this.$store.state.question.question.question;
            }
        },
        methods: {
            async createLinkAnswer() {
                this.uploadRunning = true;
                try {
                    if (this.response.type === 'Youtube') {
                        let answerId = await this.$store.dispatch('question/createYoutubeAnswer',
                            {link: this.link, title: this.response.title, description: this.response.description});
                        this.$emit('close-dialog', answerId);
                    } else if (this.response.type === 'Link') {
                        let answerId = await this.$store.dispatch('question/createLinkAnswer',
                            {
                                link: this.link, title: this.response.title, description: this.response.description,
                                imageUrl: this.response.imageUrl, type: this.response.pageType
                            });
                        this.$emit('close-dialog', answerId);
                    }
                } catch (error) {
                    this.uploadRunning = false;
                }
            },
            isValidLink() {
                return v => urlRegex(true).test(v) || this.$t("validation:url")
            }

        },
        watch: {
            async link() {
                this.response = {};
                this.showErrorMessage = false;
                this.showWarningMessage = false;
                if (this.$refs.link.validate()) {
                    try {
                        let questionId = this.$store.state.question.question.questionId;
                        this.checkLink = true;
                        this.response = await this.$axios.$get(`/link/search/${questionId}`,
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
            #link-container {
                #link-image {
                    @media screen and (min-width: 700px) {
                        float: left;
                    }
                    img {
                        max-width: 300px;
                        max-height: 300px;
                        min-width: 150px;
                        @media screen and (max-width: 699px) {
                            display: block;
                            margin: 0 auto 18px auto;
                        }
                    }
                }
                #link-content {
                    @media screen and (min-width: 700px) {
                        margin-left: 324px;
                    }
                    #page-type-title {
                        font-size: 14px;
                    }
                    #page-type-container {
                        padding-top: 6px;
                    }
                }
                #link-content.image-missing {
                    margin-left: 0;
                }
            }
        }
    }
</style>
