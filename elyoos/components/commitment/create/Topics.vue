<template>
    <v-card id="dialog-create-topics-commitment">
        <div>
            <slot name="header"></slot>
        </div>
        <v-card-text id="dialog-create-bookmarks-topics-content">
            <v-container align-center>
                <v-layout row wrap justify-center>
                    <v-flex xs6 md3>
                        <topic-button topic="socialDevelopment" :image="topicImage('socialDevelopment.jpg')"
                                      :description="$t('common:topic.socialDevelopment')"
                                      @add-topic="addTopic" @remove-topic="removeTopic">
                        </topic-button>
                    </v-flex>
                    <v-flex xs6 md3>
                        <topic-button topic="environmental" :image="topicImage('environmental.jpg')"
                                      :description="$t('common:topic.environmental')"
                                      @add-topic="addTopic" @remove-topic="removeTopic">
                        </topic-button>
                    </v-flex>
                    <v-flex xs6 md3>
                        <topic-button topic="politics" :image="topicImage('politics.jpg')"
                                      :description="$t('common:topic.politics')"
                                      @add-topic="addTopic" @remove-topic="removeTopic">
                        </topic-button>
                    </v-flex>
                    <v-flex xs6 md3>
                        <topic-button topic="economy" :image="topicImage('economy.jpg')"
                                      :description="$t('common:topic.economy')"
                                      @add-topic="addTopic" @remove-topic="removeTopic">
                        </topic-button>
                    </v-flex>
                    <v-flex xs6 md3>
                        <topic-button topic="personalDevelopment" :image="topicImage('personalDevelopment.jpg')"
                                      :description="$t('common:topic.personalDevelopment')"
                                      @add-topic="addTopic" @remove-topic="removeTopic">
                        </topic-button>
                    </v-flex>
                    <v-flex xs6 md3>
                        <topic-button topic="education" :image="topicImage('education.jpg')"
                                      :description="$t('common:topic.education')"
                                      @add-topic="addTopic" @remove-topic="removeTopic">
                        </topic-button>
                    </v-flex>
                    <v-flex xs6 md3>
                        <topic-button topic="health" :image="topicImage('health.jpg')"
                                      :description="$t('common:topic.health')"
                                      @add-topic="addTopic" @remove-topic="removeTopic">
                        </topic-button>
                    </v-flex>
                    <v-flex xs6 md3>
                        <topic-button topic="spiritual" :image="topicImage('spiritual.jpg')"
                                      :description="$t('common:topic.spiritual')"
                                      @add-topic="addTopic" @remove-topic="removeTopic">
                        </topic-button>
                    </v-flex>
                </v-layout>
            </v-container>
            <div id="topic-description">{{$t("pages:commitment.createDialog.topicDescription")}}</div>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" flat @click.native="$emit('close-dialog')">
                {{$t("common:button.close")}}
            </v-btn>
            <v-btn color="primary" @click.native="finish" :disabled="topics.length === 0">
                {{actionButtonText}}
            </v-btn>
        </v-card-actions>
    </v-card>
</template>

<script>
    import TopicButton from './TopicButton';

    export default {
        props: ['actionButtonText'],
        data() {
            return {topics: []}
        },
        components: {TopicButton},
        methods: {
            topicImage(name) {
                return `${process.env.staticUrl}/img/topics/${name}`;
            },
            addTopic(topic) {
                this.topics.push(topic);
            },
            removeTopic(topic) {
                this.topics = this.topics.filter((v) => v !== topic);
            },
            finish(event) {
                event.preventDefault();
                if (this.topics.length > 0) {
                    this.$emit('finish', this.topics);
                }
            }
        }
    }
</script>

<style lang="scss">
    #dialog-create-topics-commitment {
        max-width: 650px;
        #dialog-create-bookmarks-topics-content {
            max-width: 100%;
        }
        #topic-description {
            padding-left: 12px;
            font-weight: 300;
        }
    }
</style>
