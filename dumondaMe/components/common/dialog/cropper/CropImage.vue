<template>
    <v-card id="dialog-upload-cropped-image">
        <v-card-text id="dialog-upload-cropped-image-content" class="mobile-dialog-content">
            <div id="cropper-image">
                <img :src="imgSrc" ref="cropper">
            </div>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions id="upload-cropped-image-actions">
            <div id="cropped-image-modification-actions" class="cropped-image-action-block">
                <input type="file" accept="image/*" style="display: none" ref="openFileDialog"
                       @change="handleImageChange"/>
                <v-btn text icon color="primary" @click="openUploadImage()" :disabled="uploadRunning">
                    <v-icon>{{$icons.mdiImage}}</v-icon>
                </v-btn>
                <v-btn text icon @click="imageCropper.rotate(-90)" :disabled="uploadRunning">
                    <v-icon>{{$icons.mdiRotateLeft}}</v-icon>
                </v-btn>
                <v-btn text icon @click="imageCropper.rotate(90)" :disabled="uploadRunning">
                    <v-icon>{{$icons.mdiRotateRight}}</v-icon>
                </v-btn>
            </div>
            <v-spacer></v-spacer>
            <div class="cropped-image-action-block">
                <v-spacer></v-spacer>
                <v-btn color="primary" text @click.native="$emit('close')">
                    {{$t("common:button.abort")}}
                </v-btn>
                <v-btn color="primary" @click.native="$emit('action', imageCropper)"
                       :loading="uploadRunning" :disabled="uploadRunning">
                    {{actionLabel}}
                </v-btn>
            </div>
        </v-card-actions>
    </v-card>
</template>

<script>
    import Cropper from 'cropperjs/dist/cropper.min.js';
    import {mdiImage, mdiRotateLeft, mdiRotateRight} from "@mdi/js";

    export default {
        props: ['initialImage', 'actionLabel', 'uploadRunning', 'aspectRatio'],
        data() {
            return {image: this.initialImage, imgSrc: null, imageCropper: null}
        },
        created() {
            this.$icons = {mdiImage, mdiRotateLeft, mdiRotateRight};
        },
        mounted: function () {

            this.imageCropper = new Cropper(this.$refs.cropper, {
                aspectRatio: this.aspectRatio,
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
            }
        }
    }
</script>

<style lang="scss">
    #dialog-upload-cropped-image {
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
        #upload-cropped-image-actions {
            @media screen and (max-width: 600px) {
                display: block;
            }
            .cropped-image-action-block {
                display: flex;
            }
        }
        #cropped-image-modification-actions {
            @media screen and (max-width: 600px) {
                margin-bottom: 18px;
                justify-content: center;
            }
        }
    }
</style>
