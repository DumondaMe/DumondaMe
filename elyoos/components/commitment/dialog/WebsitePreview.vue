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
                        <p id="website-successfully-loaded" v-if="previewLoaded && !checkLink">
                            {{$t('pages:commitment.createDialog.websiteLoaded')}}
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
    import urlRegex from '~/utils/url';

    export default {
        data() {
            return {checkLink: false, link: '', valid: true, previewLoaded: false}
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
            }
        },
        mixins: [validationRules],
        watch: {
            async link() {
                this.response = {};
                if (this.$refs.link.validate() && this.link.trim() !== '') {
                    try {
                        this.checkLink = true;
                        await this.$store.dispatch('createCommitment/getWebsitePreview', this.link);
                        this.checkLink = false;
                        this.previewLoaded = true;
                    } catch (error) {
                        this.checkLink = false;
                    }
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
        }
    }
</style>
