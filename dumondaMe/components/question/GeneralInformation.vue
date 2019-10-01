<template>
    <div class="general-info-container ely-card">
        <div class="question-info" v-if="question.isAdmin">
            <v-icon class="info-icon icon-admin">mdi-account</v-icon>
            {{$t('common:youAreAdmin')}}
        </div>
        <div class="question-info">
            <v-icon class="info-icon">mdi-clock-outline</v-icon>
            <time class="question-info-content" itemprop="dateCreated" :datetime="dateCreatedIso">
                {{question.created | formatRelativeTimesAgo}}
            </time>
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
    import format from 'date-fns/format'

    export default {
        mixins: [language],
        computed: {
            question() {
                return this.$store.state.question.question;
            },
            dateCreatedIso() {
                return format(this.question.created * 1000, 'YYYY-MM-DDTHH:mm') + 'Z';
            }
        }
    }
</script>

<style lang="scss">
    .general-info-container {
        margin-bottom: 12px;
        @include defaultPaddingCard();

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
