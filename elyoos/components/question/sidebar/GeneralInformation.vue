<template>
    <div class="sidebar-container">
        <h3>Allgemeine Informationen</h3>
        <div id="topic-container">
            <span class="topic" v-for="topic in question.topic">{{getTopicText(topic)}}</span>
        </div>
    </div>
</template>

<script>
    import topic from '~/mixins/topics.js';

    export default {
        mixins: [topic],
        computed: {
            question() {
                return this.$store.state.question.question;
            }
        }
    }
</script>

<style lang="scss">
    #topic-container {
        .topic {
            margin-right: 8px;
            background-color: #78909C;
            color: #ffffff;
            padding: 4px;
            border-radius: 4px;
            font-size: 12px;
        }
    }
</style>
