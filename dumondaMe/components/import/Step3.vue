<template>
    <v-card class="import-contact-text">
        <div id="dumonda-me-dialog-header">
            {{$t('dialog:invite:text.title')}}
        </div>
        <v-divider></v-divider>
        <v-card-text class="mobile-dialog-content">
            <div class="text-description">{{$t('dialog:invite:text.description')}}</div>
            <div class="select-language">
                <v-select v-model="language"
                          :label="$t('pages:feeds.selectLanguage')"
                          :rules="[ruleSelectRequired($t('validation:fieldRequired'))]"
                          :items="getLanguages()"
                          single-line required>
                </v-select>
            </div>
            <v-form v-model="valid">
                <v-textarea type="text" v-model="text" name="userText"
                            class="user-text"
                            :label="$t('dialog:invite:text.label')"
                            :rules="[ruleFieldRequired($t('validation:fieldRequired')),
                                     ruleToManyChars($t('validation:toManyChars'), 1000)]"
                            :counter="1000" auto-grow>
                </v-textarea>
            </v-form>
        </v-card-text>
        <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" text @click.native="$emit('close-dialog')">
                {{$t("common:button.close")}}
            </v-btn>
            <v-btn color="primary" text @click.native="$emit('back')">
                {{$t("common:button.back")}}
            </v-btn>
            <v-btn color="primary" @click="$emit('next', {text, language})" :disabled="!valid">
                {{$t("common:button.next")}}
            </v-btn>
        </v-card-actions>
    </v-card>
</template>

<script>
    import ProfileImage from '~/components/info/welcomeDialog/ProfileImage'
    import validationRules from '~/mixins/validationRules.js';
    import languages from '~/mixins/languages.js';

    export default {
        data() {
            return {
                text: this.$t('dialog:invite:text.template'), valid: true,
                language: this.$store.state.i18n.language
            }
        },
        components: {ProfileImage},
        mixins: [validationRules, languages]
    }
</script>

<style lang="scss">
    .import-contact-text {

        .text-description {
            margin-bottom: 18px;
            color: $primary-text;
            font-size: 16px;
            font-weight: 300;
        }
    }
</style>
