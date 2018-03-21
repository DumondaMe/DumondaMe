<template>
    <v-layout row justify-center>
        <v-dialog v-model="dialog" scrollable persistent max-width="500px">
            <v-card id="dialog-upload-cropped-image">
                <v-card-text id="dialog-upload-cropped-image-content">
                    <div id="cropper-image">
                        <img :src="imgSrc" ref="cropper">
                    </div>
                </v-card-text>
                <v-divider></v-divider>
                <v-card-actions>
                    <input type="file" accept="image/*" style="display: none" ref="openFileDialog"
                           @change="handleImageChange"/>
                    <v-btn flat icon color="primary" @click="openUploadImage()" :disabled="uploadRunning">
                        <v-icon>insert_photo</v-icon>
                    </v-btn>
                    <v-btn flat icon @click="imageCropper.rotate(-90)" :disabled="uploadRunning">
                        <v-icon>rotate_left</v-icon>
                    </v-btn>
                    <v-btn flat icon @click="imageCropper.rotate(90)" :disabled="uploadRunning">
                        <v-icon>rotate_right</v-icon>
                    </v-btn>
                    <v-spacer></v-spacer>
                    <v-btn color="primary" flat @click.native="$emit('close-dialog')">
                        {{$t("common:button.abort")}}
                    </v-btn>
                    <v-btn color="primary" @click.native="uploadImage()" :loading="uploadRunning"
                           :disabled="uploadRunning">
                        {{$t("common:button.upload")}}
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-layout>
</template>

<script>
    import {dataURItoBlob} from '~/utils/files/fileReaderUtil.js';
    import {uploadFileToUrl} from '~/utils/files/upload.js';
    import Cropper from 'cropperjs/dist/cropper.min.js';

    export default {
        props: ['initialImage'],
        data() {
            return {dialog: true, image: this.initialImage, imgSrc: null, imageCropper: null, uploadRunning: false}
        },
        mounted: function () {

            this.imageCropper = new Cropper(this.$refs.cropper, {
                aspectRatio: 1,
                viewMode: 1,
                scalable: false,
                zoomOnTouch: false,
                zoomOnWheel: false,
                minCropBoxWidth: 100,
                minCropBoxHeight: 100
            });

            this.readImage(this.image);
        },
        methods: {
            readImage(image) {
                if (!image || !image.type.includes('image/')) {
                    console.log('No image');
                    return;
                }

                if (typeof FileReader === 'function') {
                    const reader = new FileReader();
                    let cropper = this.imageCropper;
                    reader.addEventListener('load', function () {
                        this.imgSrc = reader.result;
                        // rebuild cropperjs with the updated source
                        cropper.replace(reader.result);
                    }, {passive: true});

                    reader.readAsDataURL(image);
                }
            },
            openUploadImage() {
                this.$refs.openFileDialog.value = null; //Needed to open same picture twice
                this.$refs.openFileDialog.click();
            },
            handleImageChange(e) {
                if (e.target.files.length === 1) {
                    this.readImage(e.target.files[0]);
                }
            },
            uploadImage() {
                let dataCanvas = this.imageCropper.getCroppedCanvas();
                if ('toDataURL' in dataCanvas) {
                    this.uploadRunning = true;
                    this.imageCropper.disable();
                    setTimeout(async () => {
                        try {
                            let dataUrl = dataCanvas.toDataURL();
                            let blob = dataURItoBlob(dataUrl);
                            await uploadFileToUrl(this.$axios, blob, 'user/settings/uploadProfileImage');
                            this.$emit('update-image', dataUrl);
                        } catch (e) {

                        } finally {
                            this.imageCropper.enable();
                            this.uploadRunning = false;
                        }
                    }, 0);
                }
            }
        }
    }
</script>

<style lang="scss">
    #dialog-upload-cropped-image {
        max-width: 500px;
        #dialog-upload-cropped-image-content {
            #cropper-image {
                width: 100%;
                min-height: 250px;
                max-height: 500px;
                img {
                    max-height: 100%;
                    max-width: 100%;
                }
            }
        }
    }
</style>
