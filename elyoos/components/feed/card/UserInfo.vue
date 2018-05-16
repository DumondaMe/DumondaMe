<template>
    <div class="user-info-question-feed-container">
        <div class="user-infos">
            <div class="question-container" v-if="cardType !== 'Question'">
                <span class="question" @click="$router.push({name: 'question-questionId-slug',
                              params: {questionId: questionId, slug: questionSlug}})">{{question}}
                </span>
            </div>
            <div class="user-title-container" v-else>
                <v-icon class="card-type-icon">mdi-help-circle-outline</v-icon>
                <span class="card-title"
                      @click="$router.push({name: 'question-questionId-slug',
                              params: {questionId: questionId, slug: questionSlug}})">{{question}}
                </span>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        props: ['cardType', 'isAdmin', 'questionId', 'questionSlug', 'question']
    }
</script>

<style lang="scss">
    .user-info-question-feed-container {
        .user-infos {
            .user-title-container {
                display: block;
                line-height: 16px;
                .card-type-icon {
                    margin-left: -2px;
                    margin-right: 8px;
                    font-size: 22px;
                }
                .card-title {
                    cursor: pointer;
                    font-size: 16px;
                    vertical-align: middle;
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
                margin-bottom: 10px;
                line-height: 14px;
                font-weight: 400;
                font-size: 12px;
                color: $secondary-text;
                .question-icon {
                    font-size: 18px;
                    margin-right: 10px;
                }
                .question {
                    line-height: 18px;
                    vertical-align: middle;
                    color: $primary-color;
                    cursor: pointer;
                }
                :hover.question {
                    text-decoration: underline;
                }
            }
        }
    }
</style>
