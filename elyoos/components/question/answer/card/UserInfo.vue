<template>
    <div class="user-info-answer-container">
        <div class="image-container">
            <img :src="thumbnailUrl" @click="$router.push({name: 'user-userId-slug',
                     params: {userId: userId, slug: slug}})">
        </div>
        <div class="user-infos">
            <div>
                <span class="answer-type">{{answerType}} </span>
                <span class="answer-title" v-if="!link">{{answerTitle}} </span>
                <span class="answer-title" v-else><a target="_blank" :href="link" class="link">{{answerTitle}} </a></span>
                <span class="answer-by">{{$t("common:createdBy")}}</span>
                <span class="user-name" @click="$router.push({name: 'user-userId-slug',
                     params: {userId: userId, slug: slug}})" v-if="isAdmin"> {{$t("common:you")}}</span>
                <span class="user-name" @click="$router.push({name: 'user-userId-slug',
                     params: {userId: userId, slug: slug}})" v-else> {{name}}</span>
            </div>
            <div class="created-date">{{created | formatRelativeTimesAgo}}</div>
        </div>
    </div>
</template>

<script>
    export default {
        props: ['answerType', 'answerTitle', 'name', 'thumbnailUrl', 'created', 'isAdmin', 'link', 'userId', 'slug']
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
            .answer-type {
                color: $secondary-text;
                font-size: 14px;
                line-height: 16px;
            }
            .answer-title {
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
            .answer-by {
                color: $secondary-text;
                font-size: 14px;
                line-height: 16px;
            }
            .user-name {
                cursor: pointer;
                font-size: 14px;
                line-height: 16px;
            }
            :hover.user-name {
                text-decoration: underline;
            }
            .created-date {
                font-size: 12px;
                color: $secondary-text;
            }
        }
    }
</style>
