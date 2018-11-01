<template>
    <v-layout row justify-center>
        <v-dialog v-model="dialog" scrollable persistent max-width="800px">
            <v-card id="send-newsletter-dialog">
                <div id="dumonda-me-dialog-header">
                    {{$t('pages:news.dialog.title')}}
                </div>
                <v-card-text>
                    <v-form v-model="valid" v-if="!previewSent">
                        <v-text-field type="text" v-model="title"
                                      :label="$t('pages:news.dialog.newsletterTitle')"
                                      :rules="[ruleFieldRequired($t('validation:fieldRequired')),
                                       ruleToManyChars($t('validation:toManyChars'), 160)]"
                                      :counter="160">
                        </v-text-field>
                        <v-textarea v-model="text" :label="$t('pages:news.dialog.newsletterText')" auto-grow
                                    :rules="[ruleFieldRequired($t('validation:fieldRequired')),
                                       ruleToManyChars($t('validation:toManyChars'), 10000)]" :counter="10000">

                        </v-textarea>
                        <div v-html="text" class="text-preview"></div>
                    </v-form>
                    <div v-else class="confirm-send-newsletter-content">
                        <v-checkbox :label="$t('pages:news.dialog.confirmSendNewsletter')"
                                    v-model="confirmSendNewsletter" color="primary">
                        </v-checkbox>
                    </div>
                </v-card-text>
                <v-divider></v-divider>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="primary" flat :disabled="running"
                           @click.native="$emit('close-dialog')">{{$t("common:button.close")}}
                    </v-btn>
                    <v-btn color="primary" flat :disabled="running" v-if="previewSent"
                           @click.native="navigateBack">{{$t("common:button.back")}}
                    </v-btn>
                    <v-btn color="primary" @click.native="sendPreview" :loading="running" v-if="!previewSent"
                           :disabled="running || !valid">
                        {{$t('pages:news.dialog.sendPreviewButton')}}
                    </v-btn>
                    <v-btn color="primary" @click.native="sendNewsletter" :loading="running" v-else
                           :disabled="running || !confirmSendNewsletter">
                        {{$t('pages:news.dialog.sendNewsletterButton')}}
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <v-snackbar top v-model="showError" color="error" :timeout="0">{{$t("common:error.unknown")}}
            <v-btn dark flat @click="showError = false">{{$t("common:button.close")}}</v-btn>
        </v-snackbar>
    </v-layout>
</template>

<script>
    import validationRules from '~/mixins/validationRules.js';

    export default {
        data() {
            return {
                dialog: true, running: false, showError: false, previewSent: false,
                title: '', text: '', valid: false, confirmSendNewsletter: false
            }
        },
        methods: {
            async sendPreview() {
                try {
                    this.running = true;
                    this.previewSent = false;
                    await this.$axios.$post('news/preview', {title: this.title, text: this.text});
                    this.previewSent = true;
                } catch (error) {
                    this.showError = true;
                } finally {
                    this.running = false;
                }
            },
            async sendNewsletter() {
                try {
                    this.running = true;
                    await this.$axios.$post('news', {title: this.title, text: this.text});
                    this.$emit('close-dialog');
                } catch (error) {
                    this.showError = true;
                } finally {
                    this.running = false;
                }
            },
            navigateBack() {
                this.previewSent = false;
                this.confirmSendNewsletter = false;
            }
        },
        mixins: [validationRules]
    }
</script>

<style lang="scss">
    #send-newsletter-dialog {
        .text-preview {
            margin-top: 12px;
            padding-top: 8px;
            border-top: 1px solid $divider;
        }
        .confirm-send-newsletter-content {
            min-height: 100px;
        }
    }
</style>
