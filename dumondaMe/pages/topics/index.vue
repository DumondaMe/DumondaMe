<template>
    <div id="dumonda-me-topics">
        <card v-for="topic in topics" :topic-id="topic.id" :topic-description="topic.description"
              :topic-preview="topic.image" :topic-thumbnail="topic.thumbnail" :key="topic.id">
        </card>
    </div>
</template>

<script>
    import Card from '~/components/topic/Card';

    export default {
        async asyncData({app, error, store}) {
            try {
                let topics = await app.$axios.$get('topic',
                    {params: {language: store.state.i18n.language, onlyMainTopics: true}});
                return {topics};
            } catch (e) {
                if (e && e.request && e.request.res && e.request.res.statusCode) {
                    error({statusCode: e.request.res.statusCode});
                } else {
                    error();
                }
            }
        },
        components: {Card}
    }
</script>

<style lang="scss">
    #dumonda-me-topics {
        padding-top: 28px;
        display: flex;
        flex-wrap: wrap;

        @media screen and (max-width: 959px) {
            width: 600px;
            margin-right: auto;
            margin-left: auto;
        }

        @media screen and (max-width: 600px) {
            width: 300px;
        }
    }
</style>