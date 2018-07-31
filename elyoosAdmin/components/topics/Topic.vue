<template>
    <div class="elyoos-topic ely-card">
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
            <v-btn outline color="primary" @click="showEditMainTopicDialog = true">
                {{$t('pages:topics.editMainTopicDialog')}}
            </v-btn>
            <v-btn outline color="primary" @click="showAddSubTopicDialog = true">
                {{$t('pages:topics.addMainTopicDialog')}}
            </v-btn>
        </div>
        <create-sub-topic-dialog v-if="showAddSubTopicDialog" @close-dialog="showAddSubTopicDialog = false"
                                 :init-parent-topic-id="topic.topicId">
        </create-sub-topic-dialog>
    </div>
</template>

<script>
    import CreateSubTopicDialog from '~/components/topics/dialog/CreateSubTopic'

    export default {
        props: ['topic'],
        components: {CreateSubTopicDialog},
        data() {
            return {showEditMainTopicDialog: false, showAddSubTopicDialog: false}
        },
        computed: {
            getLanguage() {
                return this.$store.state.i18n.language
            }
        },
        methods: {}
    }
</script>

<style lang="scss">
    .elyoos-topic {
        margin-bottom: 18px;
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
</style>
