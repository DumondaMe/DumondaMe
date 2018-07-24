<template>
    <div id="elyoos-topics-overview">
        <v-btn color="primary" @click="showCreateMainTopicDialog = true">
            <v-icon left>mdi-plus-box-outline</v-icon>
            {{$t('pages:topics.createMainTopicDialog')}}
        </v-btn>
        <div v-for="mainTopic in mainTopics">
            {{mainTopic.de}}
        </div>
        <create-main-topic-dialog v-if="showCreateMainTopicDialog" @close-dialog="showCreateMainTopicDialog = false">
        </create-main-topic-dialog>
    </div>
</template>

<script>
    import CreateMainTopicDialog from '~/components/topics/dialog/CreateMainTopic'

    export default {
        data() {
            return {showCreateMainTopicDialog: false}
        },
        components: {CreateMainTopicDialog},
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

    }
</style>
