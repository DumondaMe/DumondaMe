<template>
    <v-flex xs12>
        <div id="link-container">
            <div v-if="linkData.imageUrl" id="link-image">
                <img :src="linkData.imageUrl" v-if="linkData.imageUrl"/>
            </div>
            <div id="link-content" :class="{'image-missing': !linkData.imageUrl}">
                <v-text-field v-model="linkData.title"
                              :label="$t('common:title')"
                              :rules="[ruleFieldRequired($t('validation:fieldRequired')),
                                               ruleToManyChars($t('validation:toManyChars'), 140)]" :counter="140">
                </v-text-field>
                <v-textarea v-model="linkData.description" rows="4"
                              :label="$t('pages:question.answerDialog.answerDescriptionLink')"
                              :rules="[ruleToManyChars($t('validation:toManyChars'), 1000)]" :counter="1000">
                </v-textarea>
                <div id="page-type-title">{{$t('pages:question.answerLinkDialog.typeOfWebsiteDescription')}}</div>
                <v-radio-group v-model="linkData.pageType" column id="page-type-container"
                               :rules="[ruleSelectRequired($t('validation:fieldRequired'))]">
                    <v-radio :label="$t('pages:question.answerLinkDialog.typeArticle')" value="article" color="primary">
                    </v-radio>
                    <v-radio :label="$t('pages:question.answerLinkDialog.typeBlog')" value="blog" color="primary">
                    </v-radio>
                    <v-radio :label="$t('pages:question.answerLinkDialog.typeWebsite')" value="website" color="primary">
                    </v-radio>
                </v-radio-group>
            </div>
        </div>
    </v-flex>
</template>

<script>
    import validationRules from '~/mixins/validationRules.js';

    export default {
        props: ['initLinkData', 'link', 'answerId'],
        data() {
            return {
                linkData: JSON.parse(JSON.stringify(this.initLinkData))
            }
        },
        mixins: [validationRules],
        mounted() {
            if (this.answerId) {
                this.$emit('upload-command', this.editLinkAnswer)
            } else {
                this.$emit('upload-command', this.createLinkAnswer)
            }
        },
        watch: {
            linkData: {
                handler(newLinkData) {
                    if (this.answerId) {
                        this.$emit('link-data-changed', this.initLinkData.title !== newLinkData.title ||
                            this.initLinkData.description !== newLinkData.description ||
                            this.initLinkData.pageType !== newLinkData.pageType);
                    } else {
                        this.$emit('link-data-changed', true);
                    }
                },
                deep: true
            }
        },
        methods: {
            async createLinkAnswer() {
                let answerId = await this.$store.dispatch('question/createLinkAnswer', {
                    link: this.link, title: this.linkData.title, description: this.linkData.description,
                    imageUrl: this.linkData.imageUrl, type: this.linkData.pageType
                });
                this.$emit('close-dialog', answerId);
            },
            async editLinkAnswer() {
                await this.$store.dispatch('question/editLinkAnswer', {
                    title: this.linkData.title, description: this.linkData.description,
                    type: this.linkData.pageType, answerId: this.answerId
                });
                this.$emit('close-dialog');
            }
        }
    }
</script>

<style lang="scss">
    #link-answer-container {
        #link-answer-content {
            #link-container {
                @media screen and (min-width: 700px) {
                    display: flex;
                }
                #link-image {
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
                    width: 100%;
                    @media screen and (min-width: 700px) {
                        margin-left: 18px;
                    }
                    #page-type-title {
                        font-size: 14px;
                    }
                    #page-type-container {
                        padding-top: 6px;
                        label {
                            width: auto;
                        }
                    }
                }
                #link-content.image-missing {
                    margin-left: 0;
                }
            }
        }
    }
</style>
