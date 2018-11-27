<template>
    <v-card id="welcome-languages-container">
        <div>
            <slot name="header"></slot>
        </div>
        <v-card-text class="mobile-dialog-content">
            <div id="welcome-dialog-title">{{$t("pages:settings.languagesTitle")}}</div>
            <div class="languages-description">{{$t('pages:settings.languagesDescription')}}</div>
            <div class="select-languages-container">
                <div class="selected-language" v-for="language in getLanguagesTranslated()" :key="language.value">
                    <v-checkbox v-model="selectedLanguages" :label="language.text"
                                :value="language.value" :disabled="loading">
                    </v-checkbox>
                </div>
            </div>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" flat @click="$emit('close-dialog')">
                {{$t("common:button.close")}}
            </v-btn>
            <v-btn color="primary" @click="$emit('next')" :disabled="loading || selectedLanguages.length === 0"
                   :loading="loading">
                {{$t("common:button.next")}}
            </v-btn>
        </v-card-actions>
        <v-snackbar top v-model="showError" color="error" :timeout="0">{{$t("common:error.unknown")}}
            <v-btn dark flat @click="showError = false">{{$t("common:button.close")}}</v-btn>
        </v-snackbar>
    </v-card>
</template>

<script>
    import language from '~/mixins/languages.js';

    export default {
        props: ['initLanguages'],
        mixins: [language],
        data() {
            let selectedLanguages = [];
            if (this.initLanguages && this.initLanguages.length > 0) {
                selectedLanguages = JSON.parse(JSON.stringify(this.initLanguages));
            }
            return {
                loading: false, showError: false, selectedLanguages
            }
        },
        watch: {
            async selectedLanguages(newLanguages) {
                if (newLanguages && newLanguages.length > 0) {
                    try {
                        this.loading = true;
                        await this.$axios.$put(`user/settings/languages`, {languages: newLanguages});
                    } catch (error) {
                        this.showError = true;
                    } finally {
                        this.loading = false;
                    }
                }
            }
        }

    }
</script>

<style lang="scss">
    #welcome-languages-container {
        .languages-description {
            font-weight: 300;
            margin-bottom: 16px;
        }

        .select-languages-container {
            .selected-language {
                .v-input {
                    margin-top: 0;

                    .v-input__slot {
                        margin-bottom: 0;
                    }
                }
            }
        }
    }
</style>
