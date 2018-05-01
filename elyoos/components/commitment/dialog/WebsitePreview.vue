<template>
    <v-card id="dialog-create-commitment">
        <div>
            <slot name="header"></slot>
        </div>
        <v-card-text id="dialog-create-commitment-content">
            <v-form v-model="valid" @keydown.enter.native="goToNext">
                <v-layout row wrap>
                    <v-flex xs12>
                        <v-text-field v-model="link" name="link" ref="link" :loading="checkLink"
                                      :label="$t('pages:commitment.createDialog.link')"
                                      :rules="[isValidLink(),
                                               ruleToManyChars($t('validation:toManyChars'), 1000)]">
                        </v-text-field>
                        <p id="website-successfully-loaded" v-if="previewLoaded && !checkLink && !loadingWebsiteFailed">
                            {{$t('pages:commitment.createDialog.websiteLoaded')}}
                        </p>
                        <p id="website-loading-failed" v-else-if="!previewLoaded &&!checkLink && loadingWebsiteFailed">
                            {{$t('pages:commitment.createDialog.websiteLoadedFailed')}}
                        </p>
                        <p v-else-if="checkLink">
                            {{$t('pages:commitment.createDialog.websiteLoading')}}
                        </p>
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
            <v-btn color="primary" @click.native="$emit('next')" :disabled="checkLink" :loading="checkLink"
                   v-if="previewLoaded">
                {{$t("common:button.next")}}
            </v-btn>
            <v-btn color="primary" @click.native="$emit('next')" :disabled="checkLink" :loading="checkLink" v-else>
                {{$t("pages:commitment.createDialog.noWebsiteButton")}}
            </v-btn>
        </v-card-actions>
    </v-card>
</template>

<script>
    import validationRules from '~/mixins/validationRules.js';
    import debounce from 'debounce';
    import urlRegex from '~/utils/url';

    export default {
        data() {
            return {checkLink: false, link: '', valid: true, previewLoaded: false, loadingWebsiteFailed: false}
        },
        methods: {
            isValidLink() {
                return v => {
                    if (v.trim() === '') {
                        return true
                    }
                    return urlRegex(false).test(v) || this.$t("validation:url")
                }
            },
            goToNext(event) {
                event.preventDefault();
                if (!this.checkLink) {
                    this.$emit('next');
                }
            },
            loadWebsite: debounce(async function (link) {
                try {
                    this.checkLink = true;
                    let success = await this.$store.dispatch('createCommitment/getWebsitePreview', link);
                    this.loadingWebsiteFailed = !success;
                    this.previewLoaded = success;
                    this.checkLink = false;
                } catch (error) {
                    this.checkLink = false;
                }
            }, 500)
        },
        mixins: [validationRules],
        watch: {
            link() {
                this.response = {};
                if (this.$refs.link.validate() && this.link.trim() !== '') {
                    this.loadWebsite(this.link)
                } else {
                    this.previewLoaded = false;
                }
            }
        }
    }
</script>

<style lang="scss">
    #dialog-create-commitment {
        #dialog-create-commitment-content {
            #website-successfully-loaded {
                color: $success-text;
            }
            #website-loading-failed {
                color: $error-text;
            }
        }
    }
</style>
