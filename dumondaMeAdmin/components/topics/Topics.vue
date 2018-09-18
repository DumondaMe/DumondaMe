<template>
    <div id="elyoos-topics-overview">
        <v-btn color="primary" @click="showCreateTopicDialog = true" id="create-main-topic-button">
            <v-icon left>mdi-plus-box-outline</v-icon>
            {{$t('pages:topics.createTopicDialog')}}
        </v-btn>
        <topic :topic="mainTopic" v-for="mainTopic in mainTopics" :key="mainTopic.topicId" :is-main-topic="true"
               :class="{'is-sub-topic-expanded': mainTopic.topics && mainTopic.topics.length > 0}"></topic>
        <create-topic-dialog v-if="showCreateTopicDialog" @close-dialog="showCreateTopicDialog = false">
        </create-topic-dialog>
    </div>
</template>

<script>
    import CreateTopicDialog from '~/components/topics/dialog/CreateTopic'
    import Topic from './Topic';

    export default {
        name: 'main-topic-element',
        data() {
            return {showCreateTopicDialog: false}
        },
        components: {CreateTopicDialog, Topic},
        computed: {
            mainTopics() {
                return this.$store.state.topics.topics;
            },
            getLanguage() {
                return this.$store.state.i18n.language
            }
        },
        methods: {}
    }
</script>

<style lang="scss">
    #elyoos-topics-overview {
        #create-main-topic-button {
            margin-left: 0;
            margin-bottom: 18px;
        }
        .is-sub-topic-expanded {
            margin-bottom: 50px;
        }
    }
</style>
