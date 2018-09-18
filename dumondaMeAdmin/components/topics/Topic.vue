<template>
    <div class="dumonda-me-topic-container">
        <div class="dumonda-me-topic ely-card" :class="{'is-main-topic': isMainTopic}">
            <h2>{{topic[getLanguage]}}</h2>
            <div class="topic-content">
                <div class="topic-info">TopicId: {{topic.topicId}}
                    <span class="number-of-sub-topics">{{$t('pages:topics.numberOfSubTopics',
                    {count: topic.numberOfSubTopics})}}</span></div>
                <div class="topic-description-content">
                    <div class="language-description">
                        <span class="bold-description">{{$t('common:language.de')}}:</span> {{topic.de}}
                    </div>
                    <span class="bold-description similar-description"> {{$t('common:similar')}}: </span>
                    <span v-if="topic.similarDe && topic.similarDe.length > 0">
                    <span v-for="similar in topic.similarDe">{{similar}}</span>
                </span>
                    <span v-else>{{$t('common:none')}}</span>
                </div>
                <div class="topic-description-content">
                    <div class="language-description">
                        <span class="bold-description">{{$t('common:language.en')}}:</span> {{topic.en}}
                    </div>
                    <span class="bold-description similar-description"> {{$t('common:similar')}}: </span>
                    <span v-if="topic.similarEn && topic.similarEn.length > 0">
                    <span v-for="similar in topic.similarEn">{{similar}}</span>
                </span>
                    <span v-else>{{$t('common:none')}}</span>
                </div>
            </div>
            <div class="topic-commands">
                <v-btn outline color="primary" @click="showEditTopicDialog = true">
                    {{$t('pages:topics.editMainTopicDialog')}}
                </v-btn>
                <v-btn outline color="primary" @click="showAddTopicDialog = true">
                    {{$t('pages:topics.addSubTopicDialog')}}
                </v-btn>
                <v-btn outline color="primary" @click="getSubTopics"
                       :disabled="topic.numberOfSubTopics === 0 || showSubTopics">
                    {{$t('pages:topics.showSubTopic')}}
                </v-btn>
            </div>
            <edit-topic-dialog v-if="showEditTopicDialog" @close-dialog="showEditTopicDialog = false"
                                 :init-topic="topic" :init-parent-topic-id="topic.parentTopicId">
            </edit-topic-dialog>
            <create-topic-dialog v-if="showAddTopicDialog" @close-dialog="showAddTopicDialog = false"
                                     :init-parent-topic-id="topic.topicId">
            </create-topic-dialog>
        </div>
        <div v-if="showSubTopics" class="sub-topics-container">
            <div v-for="subTopic in topic.topics" :key="subTopic.topicId">
                <topic :topic="subTopic"></topic>
            </div>
        </div>
    </div>
</template>

<script>
    import EditTopicDialog from '~/components/topics/dialog/EditTopic'
    import CreateTopicDialog from '~/components/topics/dialog/CreateTopic'
    import Topic from './Topic';

    export default {
        name: 'topic',
        props: ['topic', 'isMainTopic'],
        components: {EditTopicDialog, CreateTopicDialog, Topic},
        data() {
            return {showEditTopicDialog: false, showAddTopicDialog: false, showSubTopics: false}
        },
        computed: {
            getLanguage() {
                return this.$store.state.i18n.language
            }
        },
        methods: {
            async getSubTopics() {
                await this.$store.dispatch('topics/getSubTopics', this.topic.topicId);
                this.showSubTopics = true;
            }
        }
    }
</script>

<style lang="scss">
    .dumonda-me-topic-container {
        .dumonda-me-topic {
            margin-bottom: 18px;
            h2 {
                font-weight: 500;
            }
            .topic-content {
                font-size: 14px;
                .topic-info {
                    margin-bottom: 12px;
                    .number-of-sub-topics {
                        cursor: pointer;
                        margin-left: 18px;
                    }
                    :hover.number-of-sub-topics {
                        text-decoration: underline;
                    }
                }
                .topic-description-content {
                    margin-top: 4px;
                    .language-description {
                        margin-right: 8px;
                        min-width: 180px;
                        display: inline-block;
                    }
                    .bold-description {
                        font-weight: 500;
                    }
                    .similar-description {
                        margin-left: 12px;
                    }
                }
            }
            .topic-commands {
                margin-top: 18px;
                button {
                    margin-left: 0;
                }
            }
        }
        .sub-topics-container {
            margin-left: 42px;
        }
        .ely-card.is-main-topic {
            border: 1px solid green;
        }
    }
</style>
