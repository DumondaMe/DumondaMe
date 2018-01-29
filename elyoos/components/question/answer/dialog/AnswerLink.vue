<template>
    <v-card id="link-answer-container">
        <v-card-title>Answers the question <span class="question-title"> {{question}} </span></v-card-title>
        <v-divider></v-divider>
        <v-card-text>
            <v-form v-model="valid">
                <v-layout row wrap>
                    <v-flex xs12>
                        <v-text-field v-model="link" name="link"
                                      :label="$t('pages:detailQuestion.yourLink')"
                                      :rules="[isValidLink(),
                                               ruleFieldRequired($t('validation:fieldRequired')),
                                               ruleToManyChars($t('validation:toManyChars'), 1000)]">
                        </v-text-field>
                        <p class="url-type" v-show="isYoutube && valid && !response.type">
                            Youtube Video Infos werden geladen</p>
                        <p class="url-type" v-show="response.type === 'Youtube'">Youtube Video erkannt</p>
                        <p class="url-type" v-show="response.type === 'Vimeo'">Vimeo Video erkannt</p>
                    </v-flex>
                    <v-flex xs12 v-if="response.type === 'Youtube' || response.type === 'Vimeo'">
                        <v-layout row wrap>
                            <v-flex xs12 md6>
                                <iframe width="300" height="200" :src="response.linkEmbed" frameBorder="0"></iframe>
                            </v-flex>
                            <v-flex xs12 md6>
                                <v-text-field v-model="response.title"
                                              :label="$t('common:title')"
                                              :rules="[ruleFieldRequired($t('validation:fieldRequired')),
                                               ruleToManyChars($t('validation:toManyChars'), 80)]">
                                </v-text-field>
                                <v-text-field v-model="response.description" multi-line rows="4"
                                              :label="$t('common:description')"
                                              :rules="[ruleFieldRequired($t('validation:fieldRequired')),
                                               ruleToManyChars($t('validation:toManyChars'), 1000)]">
                                </v-text-field>
                            </v-flex>
                        </v-layout>
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
            <v-btn color="primary" flat @click.native="createLinkAnswer()"
                   :disabled="!valid || checkLink">
                {{$t("common:button.answer")}}
            </v-btn>
        </v-card-actions>
    </v-card>
</template>

<script>
    import languages from '~/mixins/languages.js';
    import urlRegex from '~/shared/url';
    import validationRules from '~/mixins/validationRules.js';

    export default {
        data() {
            return {valid: false, checkLink: false, link: '', response: {}}
        },
        mixins: [validationRules, languages],
        computed: {
            question() {
                return this.$store.state.question.question.question;
            },
            isYoutube() {
                return /\.youtube\.com/igm.test(this.link);
            }
        },
        methods: {
            async createLinkAnswer() {
                await this.$store.dispatch('question/createLinkAnswer', {link: this.link});
            },
            isValidLink() {
                return v => urlRegex().test(v) || this.$t("validation:url")
            }
        },
        watch: {
            async link() {
                this.checkLink = true;
                this.response = {};
                if (urlRegex().test(this.link)) {
                    try {
                        this.response = await this.$axios.$get(`/link/search`, {params: {link: this.link}});
                        this.checkLink = false;
                    } catch (error) {
                        this.checkLink = false;
                    }
                }
            }
        }
    }
</script>

<style lang="scss">
    #link-answer-container {
        .url-type {
            position: relative;
            top: -20px;
            margin-bottom: -20px;
            font-size: 12px;
            color: $success-text;
        }
    }
</style>
