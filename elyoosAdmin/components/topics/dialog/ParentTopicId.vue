<template>
    <v-select :items="mainTopics" v-model="parentTopicId" class="select-parent-topic-container"
              item-value="topicId" item-text="description" @change="$emit('topic-id-changed', parentTopicId.topicId)">
    </v-select>
</template>

<script>

    export default {
        props: ['initParentTopicId'],
        data: function () {
            return {
                mainTopics: this.$store.getters['topics/getMainTopics'],
                parentTopicId: this.$store.getters['topics/getMainTopics']
                    .find((topic) => topic.topicId === this.initParentTopicId)
            };
        },
        computed: {
            changed() {
                return this.hasChanged(this.topic, this.topicCompare);
            }
        },
        methods: {}
    }
</script>

<style lang="scss">
    .select-parent-topic-container {
        margin-bottom: 24px;
    }
</style>
