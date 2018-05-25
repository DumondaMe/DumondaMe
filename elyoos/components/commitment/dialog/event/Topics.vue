<template>
    <v-card id="dialog-topic-event">
        <div>
            <slot name="header"></slot>
        </div>
        <v-card-text>
            <div class="description">{{$t('pages:commitment.createEventDialog.topicEventDescription')}}</div>
            <div class="select-all-checkbox" v-if="topics.length > 1">
                <v-checkbox :value="selectAll" :label="$t('common:selectAll')" color="primary"
                            v-model="selectAll" hide-details @change="setCheckboxes()">
                </v-checkbox>
            </div>
            <v-form v-model="valid" @keydown.enter.native="finish" ref="form">
                <div v-for="(topic, index) in topics" class="topic-check-box">
                    <v-checkbox :value="topic.selected" :key="topic.topic" :label="topic.topic" color="primary"
                                v-model="topics[index].selected" hide-details>
                    </v-checkbox>
                </div>
            </v-form>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" flat @click.native="$emit('close-dialog')">
                {{$t("common:button.close")}}
            </v-btn>
            <v-btn color="primary" @click.native="finish" :disabled="selectedTopics.length === 0"
                   :loading="loading">
                {{actionButtonText}}
            </v-btn>
        </v-card-actions>
    </v-card>
</template>

<script>
    import validationRules from '~/mixins/validationRules.js';

    export default {
        props: ['actionButtonText', 'loading', 'initTopic'],
        data() {
            return {
                valid: false, topics: this.getTopics(this.initTopic), selectAll: false
            }
        },
        methods: {
            finish(event) {
                event.preventDefault();
                if (this.selectedTopics.length > 0) {
                    this.$emit('finish', this.selectedTopics);
                }
            },
            getTopics(initTopics) {
                let topics = [];
                for (let topic of initTopics) {
                    topics.push({selected: initTopics.length <= 1, topic})
                }
                return topics;
            },
            setCheckboxes() {
                for (let topic of this.topics) {
                    topic.selected = this.selectAll;
                }
            }
        },
        computed: {
            selectedTopics() {
                let selectedTopics = [];
                for (let topic of this.topics) {
                    if (topic.selected) {
                        selectedTopics.push(topic.topic)
                    }
                }
                return selectedTopics;
            }
        },
        mixins: [validationRules]
    }
</script>

<style lang="scss">
    #dialog-topic-event {
        max-width: 650px;
        .description {
            font-weight: 300;
            margin-bottom: 12px;
        }
        .topic-check-box {
            label {
                width: auto;
                min-width: 0;
            }
        }
        .select-all-checkbox {
            label {
                width: auto;
                min-width: 0;
            }
            border-bottom: 1px solid $divider;
            margin-bottom: 8px;
        }
    }
</style>
