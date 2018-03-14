<template>
    <div id="language-setting-container">
        <h2 class="user-profile-title">{{$t("pages:settings.languageTitle")}}</h2>
        <v-select id="select-user-language" :label="$t('pages:settings.languageUI')"
                  :items="getLanguages" v-model="selectedLanguage"
                  item-value="key" item-text="description">
        </v-select>
    </div>
</template>

<script>

    export default {
        data() {
            return {
                selectedLanguage: this.$store.state.i18n.languages
                    .find(lang => lang.key === this.$store.state.i18n.language)
            }
        },
        computed: {
            user() {
                return this.$store.state.userProfile.user;
            },
            getLanguages() {
                return this.$store.state.i18n.languages
            }
        },
        watch: {
            selectedLanguage(newValue) {
                this.$store.dispatch('i18n/setLanguage', {language: newValue});
            }
        }
    }
</script>

<style lang="scss">
    #language-setting-container {
        padding-bottom: 12px;
        #select-user-language {
            margin-top: 12px;
            width: inherit;
            display: inline-block;
            min-width: 240px;
            label {
                display: inline-block;
                max-width: 100%;
            }
        }
    }
</style>
