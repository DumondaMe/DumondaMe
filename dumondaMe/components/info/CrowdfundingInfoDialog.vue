<template>
    <v-layout row justify-center>
        <v-dialog v-model="dialog" scrollable persistent max-width="700px" :fullscreen="$vuetify.breakpoint.xsOnly">
            <v-card id="crowdfunding-info-dialog">
                <div id="dumonda-me-dialog-header">
                    {{$t("dialog:crowdfunding.title")}}
                </div>
                <v-divider></v-divider>
                <v-card-text id="crowdfunding-info-dialog-content" class="mobile-dialog-content">
                    <div id="crowdfunding-preview">
                        <iframe frameborder="0" scrolling="no"
                                src="https://wemakeit.com/widgets/projects/dumondame?type=regular"
                                :width="previewWidth" :height="previewHeight"></iframe>
                    </div>
                    <div v-html="$t('dialog:crowdfunding.description')"></div>
                </v-card-text>
                <v-divider></v-divider>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="primary" flat @click.native="$emit('close-dialog')" :disabled="running">
                        {{$t("dialog:crowdfunding.buttonLater")}}
                    </v-btn>
                    <v-btn color="primary" @click.native="openCrowdfundingPage"
                           :loading="running" :disabled="running">
                        {{$t("dialog:crowdfunding.buttonToCrowdfunding")}}
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-layout>
</template>

<script>
    export default {
        data() {
            return {dialog: true, running: false}
        },
        computed: {
            previewWidth() {
                if (window.innerWidth < 450) {
                    return 320
                }
                return 364;
            },
            previewHeight() {
                if (window.innerWidth < 450) {
                    return 450
                }
                return 470;
            }
        },
        methods: {
            openCrowdfundingPage() {
                let win = window.open('https://wemakeit.com/projects/dumondame', '_blank');
                win.focus();
                this.$emit('close-dialog');
            }
        },
    }
</script>

<style lang="scss">
    #crowdfunding-info-dialog {
        max-width: 700px;

        #dumonda-me-dialog-header {
            max-width: 700px;
            color: $secondary-color;
            text-align: center;
            font-size: 20px;
        }

        #crowdfunding-info-dialog-content {
            max-width: 700px;

            b {
                font-weight: 500;
                color: $secondary-color;
            }

            #crowdfunding-preview {
                margin-bottom: 18px;

                iframe {
                    display: block;
                    margin: 0 auto;
                }
            }
        }
    }
</style>
