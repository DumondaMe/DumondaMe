<template>
    <v-card id="main-topic-dialog-container">
        <div>
            <slot name="header"></slot>
        </div>
        <v-card-text>
            <v-form v-model="valid">
                <v-select :items="mainTopics" v-model="parentTopicId" class="select-parent-topic-container"
                          item-value="topicId" item-text="description" clearable>
                </v-select>
                <div class="topic-container">
                    <h2>{{$t("common:language.de")}}</h2>
                    <v-text-field type="text" v-model="topic.de"
                                  :label="$t('pages:topics.dialog.topic.topic')"
                                  :rules="[ruleFieldRequired($t('validation:fieldRequired')),
                                       ruleToManyChars($t('validation:toManyChars'), 80)]"
                                  :counter="80">
                    </v-text-field>
                    <div class="add-similar-topic-container">
                        <v-text-field type="text" v-model="similarDe"
                                      :label="$t('pages:topics.dialog.topic.similarDescription')"
                                      :rules="[ruleToManyChars($t('validation:toManyChars'), 80),
                                               notAlreadyUsed('De')]"
                                      :counter="80">
                        </v-text-field>
                        <v-btn color="primary" @click="addSimilarTopic('De')"
                               :disabled="similarDe.trim() === '' || (topic.similarDe && !!topic.similarDe.find((v) =>
                                          v.toLowerCase() === similarDe.toLowerCase()))">
                            {{$t('pages:topics.dialog.addTopicButton')}}
                        </v-btn>
                    </div>
                    <div class="similar-topics">
                        <div class="topic" v-for="similarTopic in topic.similarDe" :key="similarTopic">
                            <v-chip @input="onTopicRemove(similarTopic, 'De')" close>
                                {{similarTopic}}
                            </v-chip>
                        </div>
                    </div>
                </div>
                <div class="topic-container">
                    <h2>{{$t("common:language.en")}}</h2>
                    <v-text-field type="text" v-model="topic.en"
                                  :label="$t('pages:topics.dialog.topic.topic')"
                                  :rules="[ruleFieldRequired($t('validation:fieldRequired')),
                                       ruleToManyChars($t('validation:toManyChars'), 80)]"
                                  :counter="80">
                    </v-text-field>
                    <div class="add-similar-topic-container">
                        <v-text-field type="text" v-model="similarEn"
                                      :label="$t('pages:topics.dialog.topic.similarDescription')"
                                      :rules="[ruleToManyChars($t('validation:toManyChars'), 80),
                                               notAlreadyUsed('En')]"
                                      :counter="80">
                        </v-text-field>
                        <v-btn color="primary" @click="addSimilarTopic('En')"
                               :disabled="similarEn.trim() === '' || (topic.similarEn && !!topic.similarEn.find((v) =>
                                          v.toLowerCase() === similarEn.toLowerCase()))">
                            {{$t('pages:topics.dialog.addTopicButton')}}
                        </v-btn>
                    </div>
                    <div class="similar-topics">
                        <div class="topic" v-for="similarTopic in topic.similarEn" :key="similarTopic">
                            <v-chip @input="onTopicRemove(similarTopic, 'En')" close>
                                {{similarTopic}}
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
            <v-btn color="primary" @click.native="actionStarted" :loading="loading"
                   :disabled="!valid || loading || !changed">
                {{actionButtonText}}
            </v-btn>
        </v-card-actions>
    </v-card>
</template>

<script>
    import validationRules from '~/mixins/validationRules.js';
    import Vue from 'vue';

    export default {
        props: ['initTopic', 'initParentTopicId', 'actionButtonText', 'loading', 'hasChanged'],
        data: function () {
            return {
                topic: JSON.parse(JSON.stringify(this.initTopic)),
                topicCompare: JSON.parse(JSON.stringify(this.initTopic)), valid: false,
                similarDe: '', similarEn: '',
                mainTopics: this.$store.getters['topics/getMainTopics'],
                parentTopicId: this.initParentTopicId,
                parentTopicIdCompare: this.initParentTopicId
            };
        },
        computed: {
            changed() {
                return this.hasChanged(this.topic, this.parentTopicId);
            }
        },
        methods: {
            addSimilarTopic(language) {
                if (!this.topic[`similar${language}`]) {
                    Vue.set(this.topic, `similar${language}`, []);
                }
                this.topic[`similar${language}`].push(this[`similar${language}`]);
                this[`similar${language}`] = '';
            },
            onTopicRemove(topicToRemove, language) {
                this.topic[`similar${language}`] = this.topic[`similar${language}`].filter(
                    (topic) => topicToRemove !== topic);
            },
            notAlreadyUsed(language) {
                if (this.topic[`similar${language}`] &&
                    this.topic[`similar${language}`].find((v) =>
                        v.toLowerCase() === this[`similar${language}`].toLowerCase())) {
                    return this.$t("pages:topics.dialog.similarWordUsed");
                }
                return true;
            },
            actionStarted() {
                let uploadData = JSON.parse(JSON.stringify(this.topic));
                if (this.parentTopicId) {
                    uploadData.parentTopicId = this.parentTopicId;
                }
                if (uploadData.similarDe && uploadData.similarDe.length === 0) {
                    delete uploadData.similarDe;
                }
                if (uploadData.similarEn && uploadData.similarEn.length === 0) {
                    delete uploadData.similarEn;
                }
                this.$emit('finish', uploadData)
            }
        },
        mixins: [validationRules]
    }
</script>

<style lang="scss">
    #main-topic-dialog-container {
        .select-parent-topic-container {
            margin-bottom: 24px;
        }
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
