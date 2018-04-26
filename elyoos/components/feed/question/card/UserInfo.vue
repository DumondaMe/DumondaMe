<template>
    <div class="user-info-question-feed-container">
        <div class="user-infos">
            <div class="user-title-container" v-if="cardType !== 'Question'">
                <v-icon class="card-type-icon">mdi-forum</v-icon>
                <span class="card-type">{{cardTypeTranslated}} </span>
                <span class="card-title" v-if="cardType === 'Commitment'"
                      @click="$router.push({name: 'commitment-commitmentId-slug',
                              params: {commitmentId: commitmentId, slug: commitmentSlug}})">
                    {{answerTitle}}
                </span>
                <span class="card-title" v-else-if="!link">{{answerTitle}} </span>
                <span class="card-title" v-else><a target="_blank" :href="link"
                                                   class="link">{{answerTitle}} </a></span>
            </div>
            <div class="user-title-container" v-else>
                <v-icon class="card-type-icon">mdi-help-circle-outline</v-icon>
                <span class="card-type">{{$t("common:question")}} </span>
                <span class="card-title"
                      @click="$router.push({name: 'question-questionId-slug',
                              params: {questionId: questionId, slug: questionSlug}})">
                    {{question}}
                </span>
            </div>
            <div class="question-container" v-if="cardType !== 'Question'">
                {{$t("pages:feeds.question.card.answersQuestion")}}:
                <span class="question" @click="$router.push({name: 'question-questionId-slug',
                              params: {questionId: questionId, slug: questionSlug}})">
                    {{question}}
                </span>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        props: ['cardType', 'cardTypeTranslated', 'answerTitle', 'isAdmin', 'link', 'commitmentId',
            'commitmentSlug', 'questionId', 'questionSlug', 'question']
    }
</script>

<style lang="scss">
    .user-info-question-feed-container {
        .user-infos {
            .user-title-container {
                display: block;
                margin-top: 4px;
                line-height: 16px;
                .card-type-icon {
                    margin-left: -2px;
                    margin-right: 6px;
                    font-size: 22px;
                }
                .card-type {
                    font-weight: 500;
                    font-size: 16px;
                    line-height: 20px;
                }
                .card-title {
                    cursor: pointer;
                    font-size: 14px;
                    line-height: 20px;
                    color: $primary-color;
                    .link {
                        text-decoration: none;
                    }
                    :hover.link {
                        text-decoration: underline;
                    }
                }
                :hover.card-title {
                    text-decoration: underline;
                }

            }
            .question-container {
                margin-top: 2px;
                line-height: 12px;
                font-size: 12px;
                color: $secondary-text;
                .question {
                    cursor: pointer;
                }
                :hover.question {
                    text-decoration: underline;
                }
            }
        }
    }
</style>
