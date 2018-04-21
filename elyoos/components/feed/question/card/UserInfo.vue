<template>
    <div class="user-info-question-feed-container">
        <div class="image-container">
            <img :src="thumbnailUrl" @click="$router.push({name: 'user-userId-slug',
                     params: {userId: userId, slug: slug}})">
        </div>
        <div class="user-infos">
            <div class="user-title-container" v-if="cardType !== 'Question'">
                <span class="card-type">{{cardTypeTranslated}} </span>
                <span class="card-title" v-if="cardType === 'Commitment'"
                      @click="$router.push({name: 'commitment-commitmentId-slug',
                              params: {commitmentId: commitmentId, slug: commitmentSlug}})">
                    {{answerTitle}}
                </span>
                <span class="card-title" v-else-if="!link">{{answerTitle}} </span>
                <span class="card-title" v-else><a target="_blank" :href="link"
                                                   class="link">{{answerTitle}} </a></span>
                <span class="secondary-text" v-if="cardType !== 'Text'">
                    {{$t("pages:feeds.question.card.inResponse")}}
                </span>
                <span class="secondary-text" v-else>{{$t("pages:feeds.question.card.inResponseText")}}</span>
                <span class="card-title secondary-card-title"
                      @click="$router.push({name: 'question-questionId-slug',
                              params: {questionId: questionId, slug: questionSlug}})">
                    {{question}}
                </span>
            </div>
            <div class="user-title-container" v-else>
                <span class="card-type">{{cardTypeTranslated}} </span>
                <span class="card-title"
                      @click="$router.push({name: 'question-questionId-slug',
                              params: {questionId: questionId, slug: questionSlug}})">
                    {{question}}
                </span>
            </div>
            <div class="created-date">{{created | formatRelativeTimesAgo}}
                {{$t("pages:feeds.question.card.createdBy")}}
            </div>
            <span class="user-name" @click="$router.push({name: 'user'})"
                  v-if="isAdmin"> {{$t("common:you")}}</span>
            <span class="user-name" @click="$router.push({name: 'user-userId-slug',
                     params: {userId: userId, slug: slug}})" v-else> {{name}}</span>
            <div class="regions" v-if="regions && regions.length > 0">
                <v-icon class="info-region">location_on</v-icon>
                <span v-for="region in regions" class="region">{{$t("regions:" + region)}}</span>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        props: ['cardTypeTranslated', 'cardType', 'answerTitle', 'name', 'thumbnailUrl', 'created', 'isAdmin',
            'link', 'userId', 'slug', 'commitmentId', 'commitmentSlug', 'regions', 'questionId', 'questionSlug',
            'question']
    }
</script>

<style lang="scss">
    .user-info-question-feed-container {
        .image-container {
            float: left;
            margin-top: 5px;
            height: 38px;
            width: 38px;
            img {
                cursor: pointer;
                border-radius: 50%;
                height: 100%;
                width: 100%;
            }
        }
        .user-infos {
            margin-left: 52px;
            .user-title-container {
                display: block;
                margin-top: 4px;
                line-height: 16px;
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
                .card-title.secondary-card-title {
                    color: $primary-text;
                }
                :hover.card-title {
                    text-decoration: underline;
                }
                .secondary-text {
                    color: $secondary-text;
                    font-size: 14px;
                    line-height: 16px;
                }
            }
            .created-date {
                display: inline-block;
                line-height: 12px;
                font-size: 12px;
                color: $secondary-text;
            }
            .user-name {
                font-weight: 400;
                cursor: pointer;
                font-size: 12px;
            }
            :hover.user-name {
                text-decoration: underline;
            }
            .regions {
                display: inline-block;
                line-height: 14px;
                margin-left: 12px;
                .info-region {
                    position: relative;
                    margin-left: -4px;
                    display: inline-block;
                    font-size: 14px;
                }
                .region {
                    font-size: 12px;
                    color: $secondary-text;
                    margin-right: 6px;
                }
            }
        }
    }
</style>
