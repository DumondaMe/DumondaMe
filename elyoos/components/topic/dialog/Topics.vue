<template>
    <v-card id="dialog-create-topic-commitment">
        <div>
            <slot name="header"></slot>
        </div>
        <v-card-text id="dialog-create-topic-commitment-content">
            <div id="topic-description">
                {{description}}
            </div>
            <v-form v-model="valid" @keydown.enter.native="addTopic" ref="form" id="add-topic-container">
                <div id="topic-input">
                    <v-text-field v-model="newTopic"
                                  :label="$t('pages:commitment.createDialog.addTopicDescription')"
                                  :rules="[ruleToManyChars($t('validation:toManyChars'), 30),
                                           topicNotAlreadyUsed(),
                                           maxNumberOfTopics(),
                                           maxNumberOfSpaces()]">
                    </v-text-field>
                </div>
                <v-btn color="primary" @click="addTopic" id="add-topic-button"
                       :disabled="!valid || newTopic.trim() === ''">
                    {{$t('pages:commitment.createDialog.addTopicButton')}}
                </v-btn>
            </v-form>
            <div id="topic-container">
                <div class="topic" v-for="topic in topics" :key="topic.name">
                    <v-chip v-model="topic.isActive" @input="onTopicRemove(topic)" close>
                        {{topic.name}}
                    </v-chip>
                </div>
            </div>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" flat @click.native="$emit('close-dialog')">
                {{$t("common:button.close")}}
            </v-btn>
            <v-btn color="primary" @click.native="finish()" :loading="loading"
                   :disabled="newTopic.trim() !== '' || !valid || topics.length === 0 || topicHasNotChanged || loading">
                {{actionButtonText}}
            </v-btn>
        </v-card-actions>
    </v-card>
</template>

<script>
    import validationRules from '~/mixins/validationRules.js';

    const MAX_NUMBER_OF_TOPICS = 15;
    const MAX_NUMBER_OF_SPACES = 2;

    export default {
        props: ['actionButtonText', 'description', 'loading', 'existingTopics'],
        data() {
            return {valid: false, newTopic: '', topics: [], originalTopics: []}
        },
        mounted() {
            if (this.existingTopics) {
                for (let existingTopic of this.existingTopics) {
                    this.topics.push({name: existingTopic, isActive: true});
                }
                this.originalTopics = JSON.parse(JSON.stringify(this.topics));
            }
        },
        computed: {
            topicHasNotChanged() {
                let equals = this.originalTopics.length === this.topics.length;
                if (equals) {
                    for (let originalTopic of this.originalTopics) {
                        if (!this.topics.find(topic => topic.name === originalTopic.name)) {
                            equals = false;
                            break;
                        }
                    }
                }
                return equals;
            }
        },
        methods: {
            normalizeTopic(topic) {
                let normalizedTopic = '';
                for (let word of topic.split(' ')) {
                    if (word.length > 1) {
                        normalizedTopic += word.charAt(0).toUpperCase() + word.slice(1) + ' '
                    } else if (word.length === 1) {
                        normalizedTopic += word.charAt(0).toUpperCase() + ' '
                    }
                }
                return normalizedTopic.trim();
            },
            addTopic(event) {
                event.preventDefault();
                if (this.$refs.form.validate() && this.newTopic.trim() !== '') {
                    this.newTopic = this.normalizeTopic(this.newTopic);
                    this.topics.push({name: this.newTopic, isActive: true});
                    this.newTopic = '';
                }
            },
            onTopicRemove(topic) {
                this.topics = this.topics.filter((v) => v.name !== topic.name);
            },
            topicNotAlreadyUsed() {
                if (this.topics.find((v) => v.name.toLowerCase() === this.newTopic.toLowerCase())) {
                    return this.$t("pages:commitment.createDialog.topicUsed");
                }
                return true;
            },
            maxNumberOfTopics() {
                return this.topics.length < MAX_NUMBER_OF_TOPICS ||
                    this.$t("pages:commitment.createDialog.maxTopics", {count: MAX_NUMBER_OF_TOPICS});
            },
            maxNumberOfSpaces() {
                if (this.newTopic.split(" ").length - 1 > MAX_NUMBER_OF_SPACES) {
                    return this.$t("pages:commitment.createDialog.toManySpaces", {count: MAX_NUMBER_OF_SPACES});
                }
                return true;
            },
            finish() {
                let topics = [];
                for (let topic of this.topics) {
                    topics.push(topic.name);
                }
                this.$emit('finish', topics);
            }
        },
        mixins: [validationRules]
    }
</script>

<style lang="scss">
    #dialog-create-topic-commitment {
        max-width: 650px;
        #dialog-create-topic-commitment-content {
            max-width: 100%;
            #topic-description {
                padding-left: 8px;
                font-weight: 300;
            }
            #add-topic-container {
                display: flex;
                #topic-input {
                    margin-left: 12px;
                    flex-grow: 1
                }
                #add-topic-button {
                    margin-top: 16px;
                    margin-right: 0;
                }
            }
            #topic-container {
                .topic {
                    display: inline-block;
                }
            }
        }
    }
</style>
