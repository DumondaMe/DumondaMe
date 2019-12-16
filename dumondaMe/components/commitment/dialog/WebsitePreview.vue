<template>
    <v-card id="dialog-create-commitment">
        <div>
            <slot name="header"></slot>
        </div>
        <v-card-text id="dialog-create-commitment-content" class="mobile-dialog-content">
            <v-form v-model="valid" @keydown.enter.native="goToNext">
                <v-layout row wrap>
                    <v-flex xs12>
                        <div id="description-website">
                            {{$t('pages:commitment.createDialog.websiteLoadingDescription')}}
                        </div>
                        <v-text-field v-model="link" name="link" ref="link" :loading="checkLink"
                                      :label="$t('pages:commitment.createDialog.link')"
                                      :rules="[isValidLink(),
                                               ruleToManyChars($t('validation:toManyChars'), 1000)]">
                        </v-text-field>
                        <p id="website-successfully-loaded" v-if="previewLoaded && !checkLink && !loadingWebsiteFailed
                        && !existingCommitment">
                            {{$t('pages:commitment.createDialog.websiteLoaded')}}
                        </p>
                        <p v-else-if="checkLink && !existingCommitment">
                            {{$t('pages:commitment.createDialog.websiteLoading')}}
                        </p>
                        <p id="warning-commitment-exists" v-else-if="existingCommitment">
                            {{$t('pages:commitment.createDialog.commitmentExists')}}
                        </p>
                        <div id="commitment-preview-container" v-if="existingCommitment">
                            <div class="image-container">
                                <img :src="existingCommitment.imageUrl">
                            </div>
                            <div class="commitment-info-container">
                                <div class="commitment-title"
                                     @click="navigateToExistingCommitment()">{{existingCommitment.title}}
                                </div>
                                <div class="commitment-description">{{existingCommitment.description}}</div>
                            </div>
                        </div>
                    </v-flex>
                </v-layout>
            </v-form>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" text @click.native="$emit('close-dialog')">
                {{$t("common:button.close")}}
            </v-btn>
            <v-btn color="primary" @click.native="$emit('next')" :disabled="checkLink" :loading="checkLink">
                {{$t("common:button.next")}}
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
            return {
                checkLink: false, link: '', valid: true, previewLoaded: false, loadingWebsiteFailed: false,
                existingCommitment: null
            }
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
            navigateToExistingCommitment() {
                if (this.existingCommitment) {
                    this.$emit('close-dialog');
                    this.$router.push({
                        name: 'commitment-commitmentId-slug',
                        params: {commitmentId: this.existingCommitment.commitmentId, slug: this.existingCommitment.slug}
                    });
                }
            }
        },
        mixins: [validationRules],
        watch: {
            link: debounce(async function (link) {
                if (this.$refs.link.validate() && this.link.trim() !== '') {
                    try {
                        this.checkLink = true;
                        let commitmentPreview = await this.$store.dispatch('createCommitment/getWebsitePreview', link);
                        this.loadingWebsiteFailed = !!commitmentPreview.error;
                        this.previewLoaded = !commitmentPreview.error;
                        this.existingCommitment = commitmentPreview.existingCommitment;
                        this.checkLink = false;
                    } catch (error) {
                        this.existingCommitment = null;
                        this.checkLink = false;
                    }
                } else {
                    this.previewLoaded = false;
                }
            }, 500)
        }
    }
</script>

<style lang="scss">
    #dialog-create-commitment {
        #dialog-create-commitment-content {
            #description-website {
                margin-bottom: 28px;
                font-size: 16px;
                font-weight: 300;
                color: $primary-text;
            }
            #website-successfully-loaded {
                color: $success-text;
            }
            #warning-commitment-exists {
                color: $warning;
            }
            #commitment-preview-container {
                .image-container {
                    float: left;
                    width: 120px;
                    height: 120px;
                    img {
                        border-radius: 2px;
                        width: 120px;
                        height: 120px;
                    }
                }
                .commitment-info-container {
                    display: block;
                    margin-left: 138px;
                    .commitment-title {
                        cursor: pointer;
                        font-size: 16px;
                        line-height: 16px;
                        color: $primary-color;
                    }
                    :hover.commitment-title {
                        text-decoration: underline;
                    }
                    .commitment-description {
                        margin-top: 8px;
                        font-size: 14px;
                        font-weight: 300;
                    }
                }
            }
        }
    }
</style>
