<template>
    <v-card id="main-topic-dialog-container">
        <div>
            <slot name="header"></slot>
        </div>
        <v-card-text>
            <v-form v-model="valid">
                <div class="topic-container">
                    <h2>{{$t("common:language.de")}}</h2>
                    <v-text-field type="text" v-model="mainTopic.de"
                                  :label="$t('pages:topics.dialog.mainTopic.topic')"
                                  :rules="[ruleFieldRequired($t('validation:fieldRequired')),
                                       ruleToManyChars($t('validation:toManyChars'), 80)]"
                                  :counter="80">
                    </v-text-field>
                    <div class="add-similar-topic-container">
                        <v-text-field type="text" v-model="similarDe"
                                      :label="$t('pages:topics.dialog.mainTopic.similarDescription')"
                                      :rules="[ruleToManyChars($t('validation:toManyChars'), 80),
                                               notAlreadyUsed('De')]"
                                      :counter="80">
                        </v-text-field>
                        <v-btn color="primary" @click="addSimilarTopic('De')"
                               :disabled="similarDe.trim() === '' || (mainTopic.similarDe && !!mainTopic.similarDe.find((v) =>
                                          v.toLowerCase() === similarDe.toLowerCase()))">
                            {{$t('pages:topics.dialog.addTopicButton')}}
                        </v-btn>
                    </div>
                    <div class="similar-topics">
                        <div class="topic" v-for="topic in mainTopic.similarDe" :key="topic">
                            <v-chip @input="onTopicRemove(topic, 'De')" close>
                                {{topic}}
                            </v-chip>
                        </div>
                    </div>
                </div>
                <div class="topic-container">
                    <h2>{{$t("common:language.en")}}</h2>
                    <v-text-field type="text" v-model="mainTopic.en"
                                  :label="$t('pages:topics.dialog.mainTopic.topic')"
                                  :rules="[ruleFieldRequired($t('validation:fieldRequired')),
                                       ruleToManyChars($t('validation:toManyChars'), 80)]"
                                  :counter="80">
                    </v-text-field>
                    <div class="add-similar-topic-container">
                        <v-text-field type="text" v-model="similarEn"
                                      :label="$t('pages:topics.dialog.mainTopic.similarDescription')"
                                      :rules="[ruleToManyChars($t('validation:toManyChars'), 80),
                                               notAlreadyUsed('En')]"
                                      :counter="80">
                        </v-text-field>
                        <v-btn color="primary" @click="addSimilarTopic('En')"
                               :disabled="similarEn.trim() === '' || (mainTopic.similarEn && !!mainTopic.similarEn.find((v) =>
                                          v.toLowerCase() === similarEn.toLowerCase()))">
                            {{$t('pages:topics.dialog.addTopicButton')}}
                        </v-btn>
                    </div>
                    <div class="similar-topics">
                        <div class="topic" v-for="topic in mainTopic.similarEn" :key="topic">
                            <v-chip @input="onTopicRemove(topic, 'En')" close>
                                {{topic}}
                            </v-chip>
                        </div>
                    </div>
                </div>
            </v-form>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" flat :disabled="loading"
                   @click.native="$emit('close-dialog')">{{$t("common:button.close")}}
            </v-btn>
            <v-btn color="primary" @click.native="$emit('finish', mainTopic)" :loading="loading"
                   :disabled="!valid || loading || !hasChanged">
                {{actionButtonText}}
            </v-btn>
        </v-card-actions>
    </v-card>
</template>

<script>
    import validationRules from '~/mixins/validationRules.js';
    import Vue from 'vue';

    export default {
        props: ['initMainTopic', 'actionButtonText', 'loading', 'isEditMode'],
        data: function () {
            return {
                mainTopic: JSON.parse(JSON.stringify(this.initMainTopic)),
                mainTopicCompare: JSON.parse(JSON.stringify(this.initMainTopic)), valid: false,
                similarDe: '', similarEn: ''
            };
        },
        computed: {
            hasChanged() {
                if (this.isEditMode) {
                    return (this.question.question !== this.questionCompare.question ||
                        this.question.description !== this.questionCompare.description ||
                        this.question.lang !== this.questionCompare.lang);
                }
                return true;
            }
        },
        methods: {
            addSimilarTopic(language) {
                if (!this.mainTopic[`similar${language}`]) {
                    Vue.set(this.mainTopic, `similar${language}`, []);
                }
                this.mainTopic[`similar${language}`].push(this[`similar${language}`]);
                this[`similar${language}`] = '';
            },
            onTopicRemove(topicToRemove, language) {
                this.mainTopic[`similar${language}`] = this.mainTopic[`similar${language}`].filter(
                    (topic) => topicToRemove !== topic);
            },
            notAlreadyUsed(language) {
                if (this.mainTopic[`similar${language}`] &&
                    this.mainTopic[`similar${language}`].find((v) =>
                        v.toLowerCase() === this[`similar${language}`].toLowerCase())) {
                    return this.$t("pages:topics.dialog.similarWordUsed");
                }
                return true;
            }
        },
        mixins: [validationRules]
    }
</script>

<style lang="scss">
    #main-topic-dialog-container {
        .topic-container {
            h2 {
                font-weight: 500;
                margin-bottom: 4px;
            }
            margin-bottom: 24px;
            .add-similar-topic-container {
                display: flex;
            }
            .similar-topics {
                .topic {
                    display: inline-block;
                    margin-left: 0;
                }
            }
        }
    }
</style>
