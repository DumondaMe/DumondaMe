<template>
    <v-card id="link-answer-container">
        <v-card-title>Answers the question <span class="question-title"> {{question}} </span></v-card-title>
        <v-divider></v-divider>
        <v-card-text>
            <v-form v-model="valid">
                <v-layout row wrap>
                    <v-flex xs12>
                        <v-text-field v-model="link" name="link" ref="link"
                                      :label="$t('pages:detailQuestion.yourLink')"
                                      :rules="[isValidLink(),
                                               isNotEmbedYoutube(),
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
                                               ruleToManyChars($t('validation:toManyChars'), 100)]" :counter="100">
                                </v-text-field>
                                <v-text-field v-model="response.description" multi-line rows="4"
                                              :label="$t('common:description')"
                                              :rules="[ruleFieldRequired($t('validation:fieldRequired')),
                                               ruleToManyChars($t('validation:toManyChars'), 1000)]" :counter="1000">
                                </v-text-field>
                            </v-flex>
                        </v-layout>
                    </v-flex>
                    <v-flex xs12 v-else-if="response.type === 'Link'">
                        <div id="link-container">
                            <div v-if="response.imageUrl" id="link-image">
                                <img :src="response.imageUrl" v-if="response.imageUrl"/>
                            </div>
                            <div id="link-content" :class="{'image-missing': !response.imageUrl}">
                                <v-text-field v-model="response.title"
                                              :label="$t('common:title')"
                                              :rules="[ruleFieldRequired($t('validation:fieldRequired')),
                                               ruleToManyChars($t('validation:toManyChars'), 140)]" :counter="140">
                                </v-text-field>
                                <v-text-field v-model="response.description" multi-line rows="4"
                                              :label="$t('common:description')"
                                              :rules="[ruleFieldRequired($t('validation:fieldRequired')),
                                               ruleToManyChars($t('validation:toManyChars'), 1000)]" :counter="1000">
                                </v-text-field>
                                <div id="page-type-title">Was für ein Weblink handelt es sich?</div>
                                <v-radio-group v-model="response.pageType" column id="page-type-container">
                                    <v-radio label="Artikel" value="article" color="primary">
                                    </v-radio>
                                    <v-radio label="Blog" value="blog" color="primary">
                                    </v-radio>
                                </v-radio-group>
                            </div>
                        </div>
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
                {{$t("common:button.create")}}
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
                return (/\.youtube\.com/i.test(this.link) || /youtu\.be/i.test(this.link))
                    && !/\/embed\//i.test(this.link);
            }
        },
        methods: {
            async createLinkAnswer() {
                if (this.response.type === 'Youtube') {
                    await this.$store.dispatch('question/createYoutubeAnswer',
                        {link: this.link, title: this.response.title, description: this.response.description});
                    this.$emit('close-dialog');
                }
            },
            isValidLink() {
                return v => urlRegex().test(v) || this.$t("validation:url")
            },
            isNotEmbedYoutube() {
                return v => !/\/embed\//i.test(v) || 'Embed youtube ist nicht erlaubt'
            }

        },
        watch: {
            async link() {
                this.checkLink = true;
                this.response = {};
                if (this.$refs.link.validate()) {
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
        #link-container {
            #link-image {
                @media screen and (min-width: 700px) {
                    float: left;
                }
                img {
                    max-width: 300px;
                    max-height: 300px;
                    min-width: 150px;
                    @media screen and (max-width: 699px) {
                        display: block;
                        margin: 0 auto 18px auto;
                    }
                }
            }
            #link-content {
                @media screen and (min-width: 700px) {
                    margin-left: 324px;
                }
                #page-type-title {
                    font-size: 14px;
                }
                #page-type-container {
                    padding-top: 6px;
                }
            }
            #link-content.image-missing {
                margin-left: 0;
            }
        }
    }
</style>
