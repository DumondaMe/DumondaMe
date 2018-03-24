<template>
    <div class="sidebar-container">
        <h3>{{$t("pages:detailQuestion.sidebar.generalInfo.title")}}</h3>
        <div id="topic-container">
            <span class="topic" v-for="topic in question.topics">{{topic}}</span>

        </div>
        <div class="question-info">
            {{$t("pages:detailQuestion.sidebar.generalInfo.createdBy")}}
            <span class="user-name" v-if="question.isAdmin" @click="$router.push({name: 'user'})">
                {{$t("common:you")}}</span>
            <span class="user-name" v-else @click="$router.push({name: 'user-userId-slug',
                     params: {userId: question.creator.userId, slug: question.creator.slug}})">
                {{question.creator.name}}</span>
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
     import language from '~/mixins/languages.js';

    export default {
        mixins: [language],
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
        .user-name {
            font-weight: 400;
            cursor: pointer;
        }
        :hover.user-name {
            text-decoration: underline;
        }
    }
</style>
