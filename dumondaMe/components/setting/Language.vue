<template>
    <div id="language-setting-container">
        <v-select id="select-user-language" :label="$t('pages:settings.language.languageUI')"
                  :items="getLanguages()" v-model="selectedLanguage"
                  item-value="value" item-text="text">
        </v-select>
        <div class="language-description">{{$t('pages:settings.language.languagesDescription')}}</div>
        <div class="select-languages-container">
            <div class="selected-language" v-for="language in getLanguagesTranslated()" :key="language.value">
                <v-checkbox v-model="selectedLanguages" :label="language.text"
                            :value="language.value" :disabled="loading">
                </v-checkbox>
            </div>
        </div>
    </div>
</template>

<script>
    import languages from '~/mixins/languages.js';

    export default {
        data() {
            return {
                selectedLanguage: this.getLanguages().find(lang => lang.value === this.$store.state.i18n.language),
                selectedLanguages: JSON.parse(JSON.stringify(this.$store.state.i18n.languages)), loading: false
            }
        },
        computed: {
            user() {
                return this.$store.state.userProfile.user;
            }
        },
        watch: {
            selectedLanguage(newValue) {
                this.$store.dispatch('i18n/setLanguage', {language: newValue});
            },
            async selectedLanguages(newLanguages) {
                if (newLanguages && newLanguages.length > 0) {
                    try {
                        this.loading = true;
                        await this.$store.dispatch('setting/setLanguages', newLanguages);
                    } catch (error) {
                        this.showError = true;
                    } finally {
                        this.loading = false;
                    }
                }
            }
        },
        mixins: [languages]
    }
</script>

<style lang="scss">
    #language-setting-container {
        padding-bottom: 12px;

        #select-user-language {
            margin-top: 12px;
        }

        .language-description {
            margin-top: 18px;
            margin-bottom: 8px;
            font-weight: 300;
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
