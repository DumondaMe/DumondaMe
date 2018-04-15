<template>
    <div class="user-info-answer-container">
        <div class="image-container">
            <img :src="thumbnailUrl" @click="$router.push({name: 'user-userId-slug',
                     params: {userId: userId, slug: slug}})">
        </div>
        <div class="user-infos">
            <div class="user-title-container">
                <span class="answer-type">{{answerTypeTranslated}} </span>
                <span class="answer-title" v-if="answerType === 'Commitment'"
                      @click="$router.push({name: 'commitment-commitmentId-slug',
                              params: {commitmentId: commitmentId, slug: commitmentSlug}})">
                    {{answerTitle}}
                </span>
                <span class="answer-title" v-else-if="!link">{{answerTitle}} </span>
                <span class="answer-title" v-else><a target="_blank" :href="link"
                                                     class="link">{{answerTitle}} </a></span>
                <span class="answer-by" v-if="answerType === 'Commitment'">{{$t("common:linkedBy")}}</span>
                <span class="answer-by" v-else>{{$t("common:createdBy")}}</span>
                <span class="user-name" @click="$router.push({name: 'user'})"
                      v-if="isAdmin"> {{$t("common:you")}}</span>
                <span class="user-name" @click="$router.push({name: 'user-userId-slug',
                     params: {userId: userId, slug: slug}})" v-else> {{name}}</span>
            </div>
            <div class="created-date">{{created | formatRelativeTimesAgo}}</div>
            <div class="regions" v-if="regions && regions.length > 0">
                <v-icon class="info-region">location_on</v-icon>
                <span v-for="region in regions" class="region">{{$t("regions:" + region)}}</span>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        props: ['answerTypeTranslated', 'answerType', 'answerTitle', 'name', 'thumbnailUrl', 'created', 'isAdmin',
            'link', 'userId', 'slug', 'commitmentId', 'commitmentSlug', 'regions']
    }
</script>

<style lang="scss">
    .user-info-answer-container {
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
            padding-top: 2px;
            .user-title-container {
                display: block;
                margin-top: 4px;
                line-height: 16px;
                //margin-bottom: 6px;
                .answer-type {
                    font-weight: 500;
                    font-size: 16px;
                    line-height: 16px;
                }
                .answer-title {
                    cursor: pointer;
                    font-size: 14px;
                    line-height: 16px;
                    color: $primary-color;
                    .link {
                        text-decoration: none;
                    }
                    :hover.link {
                        text-decoration: underline;
                    }
                }
                :hover.answer-title {
                    text-decoration: underline;
                }
                .answer-by {
                    color: $secondary-text;
                    font-size: 14px;
                    line-height: 16px;
                }
                .user-name {
                    font-weight: 400;
                    cursor: pointer;
                    font-size: 14px;
                    line-height: 16px;
                }
                :hover.user-name {
                    text-decoration: underline;
                }
            }
            .created-date {
                display: inline-block;
                line-height: 12px;
                font-size: 12px;
                color: $secondary-text;
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
