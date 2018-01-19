<template>
    <div class="user-info-container">
        <div class="image-container">
            <img :src="thumbnailUrl">
        </div>
        <div class="user-infos">
            <div class="user-name">{{name}}</div>
            <div class="created-date">{{$t("common:createdOn")}} {{created | formatTimestampToLocal}}</div>
        </div>
    </div>
</template>

<script>
    export default {
        props: ['name', 'thumbnailUrl', 'created']
    }
</script>

<style lang="scss">
    .user-info-container {
        .image-container {
            float: left;
            margin-top: 2px;
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
            .user-name {
                padding-top: 2px;
                font-size: 14px;
                line-height: 16px;
            }
            .created-date {
                padding-top: 2px;
                font-size: 12px;
                color: $secondary-text;
            }
        }
    }
</style>
