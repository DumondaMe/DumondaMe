<template>
    <div class="sidebar-container">
        <h3>{{$t("pages:detailQuestion.sidebar.generalInfo.title")}}</h3>
        <div class="question-info">
            <v-icon class="info-icon">vpn_key</v-icon>
            <div id="topic-container">
                <span class="topic" v-for="(topic, index) in question.topics">
                    {{topic}}<span v-if="index < question.topics.length - 1">, </span></span>
            </div>
        </div>
        <div class="question-info">
            <v-icon class="info-icon">account_box</v-icon>
            <div class="question-info-content">
            <span class="user-name" v-if="question.isAdmin" @click="$router.push({name: 'user'})">
                {{$t("common:you")}}</span>
                <span class="user-name" v-else @click="$router.push({name: 'user-userId-slug',
                     params: {userId: question.creator.userId, slug: question.creator.slug}})">
                {{question.creator.name}}</span>
            </div>
        </div>
        <div class="question-info">
            <v-icon class="info-icon">create</v-icon>
            <div class="question-info-content">
                {{question.created | formatDate}}
            </div>
        </div>
        <div class="question-info" v-if="question.isAdmin">
            <v-icon class="info-icon">chat_bubble_outline</v-icon>
            <div class="question-info-content">
                {{getLanguageTranslatedText(question.language)}}
            </div>
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
    .question-info {
        font-size: 14px;
        margin-bottom: 3px;
        font-weight: 300;

        #topic-container {
            margin-left: 30px;
            .topic {
                font-size: 14px;
            }
        }
        .question-info-content {
            margin-left: 30px;
            .user-name {
                font-weight: 400;
                cursor: pointer;
            }
            :hover.user-name {
                text-decoration: underline;
            }
        }
        .info-icon {
            float: left;
            margin-top: 2px;
            margin-right: 12px;
            font-size: 18px;
            color: #90A4AE;
        }
    }
</style>
