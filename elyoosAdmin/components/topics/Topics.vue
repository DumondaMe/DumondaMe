<template>
    <div id="elyoos-topics-overview">
        <v-btn color="primary" @click="showCreateMainTopicDialog = true" id="create-main-topic-button">
            <v-icon left>mdi-plus-box-outline</v-icon>
            {{$t('pages:topics.createMainTopicDialog')}}
        </v-btn>
        <topic :topic="mainTopic" v-for="mainTopic in mainTopics" :key="mainTopic.topicId" :is-main-topic="true"
               :class="{'is-sub-topic-expanded': mainTopic.topics && mainTopic.topics.length > 0}"></topic>
        <create-main-topic-dialog v-if="showCreateMainTopicDialog" @close-dialog="showCreateMainTopicDialog = false">
        </create-main-topic-dialog>
    </div>
</template>

<script>
    import CreateMainTopicDialog from '~/components/topics/dialog/CreateMainTopic'
    import Topic from './Topic';

    export default {
        name: 'main-topic-element',
        data() {
            return {showCreateMainTopicDialog: false}
        },
        components: {CreateMainTopicDialog, Topic},
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
