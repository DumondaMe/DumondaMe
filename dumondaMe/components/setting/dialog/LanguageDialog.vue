<template>
    <v-layout row justify-center>
        <v-dialog v-model="dialog" scrollable persistent max-width="300px" :fullscreen="$vuetify.breakpoint.xsOnly">
            <v-card id="dialog-set-language">
                <div id="dumonda-me-dialog-header">
                    {{$t("pages:settings.languageTitle")}}
                </div>
                <v-divider></v-divider>
                <v-card-text id="dialog-set-language-content" class="mobile-dialog-content">
                    <v-select id="select-user-language" :label="$t('pages:settings.languageUI')"
                              :items="getLanguages" v-model="language"
                              item-value="key" item-text="description">
                    </v-select>
                </v-card-text>
                <v-divider></v-divider>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="primary" flat @click.native="$emit('close-dialog')" :disabled="running">
                        {{$t("common:button.abort")}}
                    </v-btn>
                    <v-btn color="primary" @click.native="changeLanguage()"
                           :loading="running" :disabled="running || languageNotChanged">
                        {{$t("common:button.change")}}
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
    export default {
        data() {
            return {dialog: true, running: false, showError: false, language: this.$store.state.i18n.languages
                    .find(lang => lang.key === this.$store.state.i18n.language)}
        },
        computed: {
            selectedLanguage() {
                return this.$store.state.i18n.language;
            },
            getLanguages() {
                return this.$store.state.i18n.languages
            },
            languageNotChanged() {
                return this.$store.state.i18n.language === this.language.key;
            }
        },
        methods: {
            async changeLanguage() {
                try {
                    this.running = true;
                    this.$store.dispatch('i18n/setLanguage', {language: this.language});
                    this.$emit('close');
                } catch (error) {
                    this.showError = true;
                    this.running = false;
                }
            }
        }
    }
</script>

<style lang="scss">
    #dialog-set-language {
        max-width: 300px;
        #dialog-set-language-content {
            max-width: 300px;
            #select-user-language {

            }
        }
    }
</style>
