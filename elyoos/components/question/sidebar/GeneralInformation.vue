<template>
    <div class="sidebar-container">
        <h3>{{$t("pages:detailQuestion.sidebar.generalInfo.title")}}</h3>
        <div id="topic-container">
            <span class="topic" v-for="topic in question.topic">{{getTopicText(topic)}}</span>

        </div>
        <div class="question-info">
            {{$t("pages:detailQuestion.sidebar.generalInfo.createdBy")}} {{question.creator.name}}
        </div>
        <div class="question-info">
            {{$t("pages:detailQuestion.sidebar.generalInfo.created")}} {{question.created | formatDate}}
        </div>
        <div class="question-info">
            {{$t("pages:detailQuestion.sidebar.generalInfo.language")}} {{getLanguageTranslatedText(question.language)}}
        </div>
    </div>
</template>

<script>
    import topic from '~/mixins/topics.js';
    import language from '~/mixins/languages.js';

    export default {
        mixins: [topic, language],
        computed: {
            question() {
                return this.$store.state.question.question;
            }
        }
    }
</script>

<style lang="scss">
    #topic-container {
        margin-bottom: 12px;
        .topic {
            margin-right: 8px;
            background-color: #78909C;
            color: #ffffff;
            padding: 4px;
            border-radius: 4px;
            font-size: 12px;
        }
    }

    .question-info {
        font-size: 14px;
        font-weight: 300;
        margin-bottom: 3px;
    }
</style>
