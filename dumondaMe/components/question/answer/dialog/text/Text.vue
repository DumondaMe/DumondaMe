<template>
    <v-card id="text-answer-container">
        <v-card-title id="answer-title" v-html="$t('pages:question.answerDialog.title', {question})">
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text class="mobile-dialog-content">
            <div class="info-answer">{{$t('pages:question.answerDialog.answerInfoText')}}</div>
            <v-form v-model="valid">
                <v-layout row wrap>
                    <v-flex xs12>
                        <v-textarea type="text" v-model="answer" name="answer" rows="7"
                                    :label="$t('pages:detailQuestion.yourAnswer')"
                                    :rules="[ruleToManyChars($t('validation:toManyChars'), 10000)]">
                        </v-textarea>
                    </v-flex>
                </v-layout>
                <answer-type-info v-if="otherAnswerTypes" :commitments="otherAnswerTypes.commitment"
                                  :youtube="otherAnswerTypes.youtube" :links="otherAnswerTypes.links"
                                  @select-changed="(value) => selectedType = value">
                </answer-type-info>
            </v-form>
        </v-card-text>
        <div class="default-answer-title-image" v-show="imgSrc">
            <div class="image-container">
                <img :src="imgSrc">
                <v-icon class="delete-button" @click="imgSrc = null" color="black" size="28">{{$icons.mdiCloseBox}}
                </v-icon>
            </div>
        </div>
        <v-spacer></v-spacer>
        <v-divider></v-divider>
        <v-card-actions>
            <input type="file" accept="image/*" style="display: none" ref="openFileDialog"
                   @change="handleImageChange"/>
            <v-btn icon @click="openUploadImage()">
                <v-icon>{{$icons.mdiImage}}</v-icon>
            </v-btn>
            <v-spacer></v-spacer>
            <v-btn color="primary" text @click.native="$emit('close-dialog')">
                {{$t("common:button.close")}}
            </v-btn>
            <v-btn color="primary" @click.native="updateTextAnswer()"
                   v-show="!otherAnswerTypes || (otherAnswerTypes && (selectedType === 'textAnswer' || !selectedType))"
                   :disabled="!valid || (answer.trim() === '' && imgSrc === null) || !hasChanged || loading ||
                              (otherAnswerTypes && !selectedType)"
                   :loading="loading">
                {{actionButtonText}}
            </v-btn>
            <v-btn color="primary" @click="$emit('change-answer-type', {type: 'video', url: selectedType.url})"
                   v-if="otherAnswerTypes && selectedType && selectedType.type === 'video'">
                <v-icon left>{{$icons.mdiVideo}}</v-icon>
                {{$t('pages:question.answerTextDialog.switchVideoButton')}}
            </v-btn>
            <v-btn color="primary" @click="$emit('change-answer-type', {type: 'commitment', commitment: selectedType})"
                   v-if="otherAnswerTypes && selectedType && selectedType.type === 'commitment'">
                <v-icon left>$vuetify.icons.mdiHumanHandsup</v-icon>
                {{$t('pages:question.answerTextDialog.switchCommitmentButton')}}
            </v-btn>
            <v-btn color="primary" @click="$emit('change-answer-type', {type: 'link', url: selectedType.url})"
                   v-if="otherAnswerTypes && selectedType && selectedType.type === 'link'">
                <v-icon left>$vuetify.icons.mdiLink</v-icon>
                {{$t('pages:question.answerTextDialog.switchLinkButton')}}
            </v-btn>
        </v-card-actions>
        <v-snackbar top v-model="showError" color="error" :timeout="0">{{$t("common:error.unknown")}}
            <v-btn dark text @click="showError = false">{{$t("common:button.close")}}</v-btn>
        </v-snackbar>
        <v-snackbar top v-model="showWarning" color="warning" :timeout="0">
            {{$t("common:warning.imageToSmall", {minWidth : '1000'})}}
            <v-btn dark text @click="showWarning = false">{{$t("common:button.close")}}</v-btn>
        </v-snackbar>
    </v-card>
</template>

<script>
    import validationRules from '~/mixins/validationRules.js';
    import AnswerTypeInfo from './AnswerTypeInfo'
    import {mdiVideo, mdiImage, mdiCloseBox} from '@mdi/js';

    const ERROR_CODE_IMAGE_TO_SMALL = 1;

    export default {
        props: ['initAnswer', 'initImage', 'answerId', 'actionButtonText'],
        components: {AnswerTypeInfo},
        created() {
            this.$icons = {mdiVideo, mdiImage, mdiCloseBox}
        },
        data() {
            this.initImage = this.initImage || null;
            return {
                valid: true, answer: this.initAnswer, loading: false, showError: false, otherAnswerTypes: null,
                selectedType: null, imgSrc: this.initImage, showWarning: false
            }
        },
        mixins: [validationRules],
        computed: {
            hasChanged() {
                return this.initAnswer !== this.answer || this.imgSrc !== this.initImage;
            },
            question() {
                return `<span class="question-title"> ${this.$store.state.question.question.question}</span>`;
            }
        },
        methods: {
            setTypeOfAnswerType(answerTypes, typeValue) {
                for (let type of answerTypes) {
                    type.type = typeValue;
                }
            },
            getCreateAnswerWithLink() {
                return !!(this.otherAnswerTypes && this.selectedType === 'textAnswer');
            },
            async updateTextAnswer() {
                let answerId;
                this.loading = true;
                try {
                    if (this.answerId) {
                        await this.$store.dispatch('question/editTextAnswer', {
                            answer: this.answer, answerId: this.answerId, image: this.imgSrc,
                            hasChangedAnswer: this.initAnswer !== this.answer,
                            hasChangedImage: this.imgSrc !== this.initImage
                        });
                    } else {
                        answerId = await this.$store.dispatch('question/createTextAnswer', {
                            answer: this.answer, image: this.imgSrc,
                            createAnswerWithLink: this.getCreateAnswerWithLink()
                        });
                    }
                    this.$emit('close-dialog', answerId);
                } catch (e) {
                    if (e.response.status === 406) {
                        this.otherAnswerTypes = e.response.data;
                        this.setTypeOfAnswerType(this.otherAnswerTypes.links, 'link');
                        this.setTypeOfAnswerType(this.otherAnswerTypes.youtube, 'video');
                        this.setTypeOfAnswerType(this.otherAnswerTypes.commitment, 'commitment');
                    } else if (e.response && e.response.data &&
                        e.response.data.errorCode === ERROR_CODE_IMAGE_TO_SMALL) {
                        this.showWarning = true;
                    } else {
                        this.showError = true;
                    }
                } finally {
                    this.loading = false;
                }
            },
            readImage(image) {
                if (!image || !image.type.includes('image/')) {
                    return;
                }

                if (typeof FileReader === 'function') {
                    const reader = new FileReader();
                    let setImage = this.setImage;
                    reader.addEventListener('load', function () {
                        setImage(reader.result);
                    }, {passive: true});

                    reader.readAsDataURL(image);
                }
            },
            setImage(imgSrc) {
                this.imgSrc = imgSrc;
            },
            openUploadImage() {
                this.$refs.openFileDialog.value = null; //Needed to open same picture twice
                this.$refs.openFileDialog.click();
            },
            handleImageChange(e) {
                if (e.target.files.length === 1) {
                    this.readImage(e.target.files[0]);
                }
            }
        },
        watch: {
            answer() {
                if (!this.loading && this.otherAnswerTypes) {
                    this.otherAnswerTypes = null;
                    this.selectedType = null;
                }
            }
        }
    }
</script>

<style lang="scss">
    #text-answer-container {
        #answer-title {
            display: block;

            .question-title {
                color: $primary-color;
                white-space: normal;
            }
        }

        .info-answer {
            font-weight: 300;
            font-size: 16px;
            color: $primary-text;
            margin-bottom: 12px;
        }

        .default-answer-title-image {
            margin-left: 24px;
            margin-bottom: 8px;

            .image-container {
                position: relative;
                max-width: 200px;

                img {
                    max-width: 100%
                }

                .delete-button {
                    position: absolute;
                    top: 0;
                    right: 0;
                }
            }
        }
    }
</style>
