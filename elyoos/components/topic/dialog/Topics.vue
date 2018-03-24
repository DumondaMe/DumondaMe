<template>
    <v-card id="dialog-create-topic-commitment">
        <div>
            <slot name="header"></slot>
        </div>
        <v-card-text id="dialog-create-topic-commitment-content">
            <v-form v-model="valid" @keydown.enter.native="addTopic" ref="form">
                <v-btn color="primary" @click="addTopic" id="add-topic-button" icon
                       :disabled="!valid || newTopic.trim() === ''">
                    <v-icon>add</v-icon>
                </v-btn>
                <div id="topic-input">
                    <v-text-field v-model="newTopic"
                                  :label="$t('pages:commitment.createDialog.addTopic')"
                                  :rules="[ruleToManyChars($t('validation:toManyChars'), 30),
                                           topicNotAlreadyUsed(),
                                           maxNumberOfTopics(),
                                           maxNumberOfSpaces()]">
                    </v-text-field>
                </div>
            </v-form>
            <div id="topic-container">
                <div class="topic" v-for="topic in topics" :key="topic.name">
                    <v-chip v-model="topic.isActive" @input="onTopicRemove(topic)" close>
                        {{topic.name}}
                    </v-chip>
                </div>
                <div id="topic-description" v-show="topics.length === 0">
                    {{description}}
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
                   :disabled="newTopic.trim() !== '' || !valid || topics.length === 0 || loading">
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
        props: ['actionButtonText', 'description', 'loading'],
        data() {
            return {valid: false, newTopic: '', topics: []}
        },
        methods: {
            addTopic(event) {
                event.preventDefault();
                if (this.$refs.form.validate() && this.newTopic.trim() !== '') {
                    this.newTopic = this.newTopic.toLowerCase();
                    this.newTopic = this.newTopic.replace(/\b\w/g, l => l.toUpperCase());
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
            #topic-input {
                display: block;
                margin-left: 58px;
            }
            #add-topic-button {
                float: left;
                margin-top: 19px;
            }
            #topic-container {
                .topic {
                    display: inline-block;
                }
                #topic-description {
                    padding-left: 12px;
                    font-weight: 300;
                }
            }
        }
    }
</style>
