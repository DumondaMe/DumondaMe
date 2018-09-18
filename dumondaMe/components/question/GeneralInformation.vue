<template>
    <div class="general-info-container ely-card">
        <div class="question-info" v-if="question.isAdmin">
            <v-icon class="info-icon icon-admin">mdi-account</v-icon>
            {{$t('common:youAreAdmin')}}
        </div>
        <div class="question-info">
            <v-icon class="info-icon">mdi-clock-outline</v-icon>
            <div class="question-info-content">
                {{question.created | formatRelativeTimesAgo}}
            </div>
        </div>
        <div class="question-info">
            <v-icon class="info-icon">mdi-key</v-icon>
            <div id="topic-container">
                <span class="topic" v-for="(topic, index) in question.topics">
                    {{topic.description}}<span v-if="index < question.topics.length - 1">, </span></span>
            </div>
        </div>
        <div class="question-info" v-if="question.isAdmin">
            <v-icon class="info-icon">mdi-web</v-icon>
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
    .general-info-container {
        h3 {
            font-size: 16px;
            border-bottom: 1px solid #ddd;
            margin-bottom: 12px;
        }
        .question-info {
            display: block;
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
            .visibility-container {
                margin-left: 30px;
            }
            .info-icon {
                float: left;
                margin-top: 2px;
                margin-right: 12px;
                font-size: 18px;
                color: #90A4AE;
            }
            i.icon-admin.v-icon {
                color: $success-text;
            }
        }
    }
</style>
