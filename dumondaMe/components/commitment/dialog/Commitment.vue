<template>
    <v-card id="dialog-create-content-commitment" v-if="!showImageCrop">
        <div>
            <slot name="header"></slot>
        </div>
        <v-card-text id="dialog-create-content-commitment-content">
            <v-form v-model="valid" @keydown.enter.native="finish" ref="form">
                <v-layout row wrap>
                    <v-flex xs12 md4>
                        <div id="commitment-image-preview-container">
                            <img v-if="commitment.imageUrl" class="commitment-image-preview"
                                 :src="commitment.imageUrl"/>
                            <img v-else class="commitment-image-preview" :src="defaultCommitmentImage"/>
                            <input type="file" accept="image/*" style="display: none" ref="openFileDialog"
                                   @change="handleImageChange"/>
                            <v-btn id="button-change-image" color="primary" @click="openCropImage()">
                                {{$t("common:button.changeImage")}}
                            </v-btn>
                        </div>
                    </v-flex>
                    <v-flex xs12 md8>
                        <v-text-field v-model="commitment.title"
                                      :label="$t('common:title')"
                                      :rules="[ruleFieldRequired($t('validation:fieldRequired')),
                                               ruleToManyChars($t('validation:toManyChars'), 100)]" :counter="100">
                        </v-text-field>
                        <v-textarea v-model="commitment.description" auto-grow rows="1"
                                      :label="$t('common:description')"
                                      :rules="[ruleFieldRequired($t('validation:fieldRequired')),
                                               ruleToManyChars($t('validation:toManyChars'), 1000)]" :counter="1000">
                        </v-textarea>
                        <v-text-field v-model="commitment.website"
                                      :label="$t('common:website')"
                                      :rules="[isValidLink(),
                                               ruleToManyChars($t('validation:toManyChars'), 1000)]">
                        </v-text-field>
                        <v-select id="select-language"
                                  :items="getLanguages" v-model="commitment.lang"
                                  item-value="key" item-text="description" persistent-hint
                                  :rules="[ruleSelectRequired($t('validation:fieldRequired'))]">
                            :hint="$t('pages:commitment.createDialog.primaryLanguageDescription')">
                            <span slot="label">{{$t('pages:commitment.createDialog.primaryLanguage')}}</span>
                        </v-select>
                    </v-flex>
                </v-layout>
            </v-form>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" flat @click.native="$emit('close-dialog')">
                {{$t("common:button.close")}}
            </v-btn>
            <v-btn color="primary" @click.native="finish" :disabled="!valid || !hasChanged || loading"
                   :loading="loading">
                {{actionButtonText}}
            </v-btn>
        </v-card-actions>
    </v-card>
    <crop-image v-else :initial-image="imageToCrop" :action-label="$t('common:button.ok')"
                @close="showImageCrop = false" @action="setImage">
    </crop-image>
</template>

<script>
    import validationRules from '~/mixins/validationRules.js';
    import urlRegex from '~/utils/url';
    import CropImage from '~/components/common/dialog/cropper/CropImage';

    export default {
        props: ['actionButtonText', 'initCommitment', 'loading', 'isModifyMode'],
        data() {
            return {
                commitment: JSON.parse(JSON.stringify(this.initCommitment)),
                commitmentCompare: JSON.parse(JSON.stringify(this.initCommitment)),
                valid: false,
                imageToCrop: null,
                showImageCrop: false
            }
        },
        components: {CropImage},
        methods: {
            isValidLink() {
                return v => {
                    if (!v || v.trim() === '') {
                        return true
                    }
                    return urlRegex(true).test(v) || this.$t("validation:url")
                }
            },
            openCropImage() {
                this.$refs.openFileDialog.value = null; //Needed to open same picture twice
                this.$refs.openFileDialog.click();
            },
            handleImageChange(e) {
                if (e.target.files.length === 1) {
                    this.showImageCrop = true;
                    this.imageToCrop = e.target.files[0];
                }
            },
            setImage(imageCropper) {
                let dataCanvas = imageCropper.getCroppedCanvas();
                if ('toDataURL' in dataCanvas) {
                    this.commitment.imageUrl = dataCanvas.toDataURL();
                }
                this.showImageCrop = false;
            },
            finish(event) {
                event.preventDefault();
                if (this.$refs.form.validate()) {
                    let imageHasChanged = this.commitment.imageUrl !== this.commitmentCompare.imageUrl;
                    this.$emit('finish', {commitment: this.commitment, imageHasChanged});
                }
            }
        },
        computed: {
            hasChanged() {
                if (this.isModifyMode) {
                    if (typeof this.commitment.website === 'string' && this.commitment.website.trim() === '') {
                        delete this.commitment.website;
                    }
                    return (this.commitment.title !== this.commitmentCompare.title ||
                        this.commitment.description !== this.commitmentCompare.description ||
                        this.commitment.lang !== this.commitmentCompare.lang ||
                        this.commitment.website !== this.commitmentCompare.website ||
                        this.commitment.imageUrl !== this.commitmentCompare.imageUrl);
                }
                return true;
            },
            defaultCommitmentImage() {
                return `${process.env.staticUrl}/img/defaultCommitmentTitle.jpg`;
            },
            getLanguages() {
                return this.$store.state.i18n.languages
            }
        },
        mixins: [validationRules]
    }
</script>

<style lang="scss">
    #dialog-create-content-commitment {
        max-width: 650px;
        #dialog-create-content-commitment-content {
            max-width: 650px;
            #commitment-image-preview-container {
                width: 150px;
                .commitment-image-preview {
                    max-width: 100%;
                }
                #button-change-image {
                    width: 100%;
                    margin: 8px 0 0 0;
                }
            }
            #select-language {
                label {
                    display: inline-block;
                    max-width: 100%;
                }
            }
        }
    }
</style>
