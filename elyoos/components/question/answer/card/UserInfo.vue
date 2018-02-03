<template>
    <div class="user-info-answer-container">
        <div class="image-container">
            <img :src="thumbnailUrl">
        </div>
        <div class="user-infos">
            <div>
                <span class="answer-type">{{answerType}} </span>
                <span class="answer-title">{{answerTitle}} </span>
                <span class="answer-by">{{$t("common:createdBy")}}</span>
                <span class="user-name" v-if="isAdmin"> Dir</span>
                <span class="user-name" v-else> {{name}}</span>
            </div>
            <div class="created-date">{{created | formatRelativeTimesAgo}}</div>
        </div>
    </div>
</template>

<script>
    export default {
        props: ['answerType', 'answerTitle', 'name', 'thumbnailUrl', 'created', 'isAdmin']
    }
</script>

<style lang="scss">
    .user-info-answer-container {
        .image-container {
            float: left;
            margin-top: 5px;
            height: 32px;
            width: 32px;
            img {
                border-radius: 50%;
                height: 100%;
                width: 100%;
            }
        }
        .user-infos {
            margin-left: 44px;
            .answer-type {
                color: $secondary-text;
                font-size: 12px;
                line-height: 16px;
            }
            .answer-title {
                font-size: 14px;
                line-height: 16px;
                color: $primary-color;
            }
            .answer-by {
                color: $secondary-text;
                font-size: 12px;
                line-height: 16px;
            }
            .user-name {
                font-size: 12px;
                line-height: 16px;
            }
            .created-date {
                font-size: 12px;
                color: $secondary-text;
            }
        }
    }
</style>
